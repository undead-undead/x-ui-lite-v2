use crate::errors::ApiResult;
use crate::models::inbound::Inbound;
use crate::services::system_service::SharedMonitor;
use crate::services::xray_service;
use sqlx::SqlitePool;
use tokio::process::Command;
use tokio::time::{interval, Duration};

pub fn start_traffic_stats_task(pool: SqlitePool, monitor: SharedMonitor) {
    // Traffic stats disabled for xray-lite (no API support)
    // xray-lite doesn't provide gRPC API for statistics
    tracing::info!("Traffic stats task disabled (xray-lite doesn't support API)");
    
    // Keep the function signature for compatibility, but don't start the task
    let _ = pool;
    let _ = monitor;
}

async fn update_traffic_stats(pool: &SqlitePool, monitor: SharedMonitor) -> ApiResult<()> {
    let inbounds = sqlx::query_as::<_, Inbound>("SELECT * FROM inbounds WHERE enable = 1")
        .fetch_all(pool)
        .await?;

    if inbounds.is_empty() {
        return Ok(());
    }

    let xray_bin = std::env::var("XRAY_BIN_PATH").unwrap_or_else(|_| "./bin/xray".to_string());
    let mut needs_reapply = false;

    let stats_map = query_all_xray_stats(&xray_bin).await.unwrap_or_default();

    tracing::info!("Traffic stats query returned {} entries", stats_map.len());
    if stats_map.is_empty() && !inbounds.is_empty() {
        tracing::warn!(
            "No stats retrieved from Xray API despite having {} enabled inbounds",
            inbounds.len()
        );
    }

    for inbound in inbounds {
        let tag = inbound
            .tag
            .clone()
            .unwrap_or_else(|| format!("inbound-{}", inbound.id));

        let up_key = format!("inbound>>>{}>>>traffic>>>uplink", tag);
        let down_key = format!("inbound>>>{}>>>traffic>>>downlink", tag);

        let uplink = stats_map.get(&up_key).cloned().unwrap_or(0);
        let downlink = stats_map.get(&down_key).cloned().unwrap_or(0);

        tracing::info!(
            "Node '{}' (tag={}): looking for keys '{}' and '{}', found uplink={}, downlink={}",
            inbound.remark,
            tag,
            up_key,
            down_key,
            uplink,
            downlink
        );

        if uplink > 0 || downlink > 0 {
            let new_up = inbound.up + uplink;
            let new_down = inbound.down + downlink;
            let mut enable = 1;

            if inbound.total > 0 && (new_up + new_down) >= inbound.total {
                enable = 0;
                needs_reapply = true;
                tracing::info!("Node {} reached traffic quota, disabling.", inbound.remark);
            }

            sqlx::query("UPDATE inbounds SET up = ?, down = ?, enable = ? WHERE id = ?")
                .bind(new_up)
                .bind(new_down)
                .bind(enable)
                .bind(&inbound.id)
                .execute(pool)
                .await?;

            tracing::debug!(
                "Node {} ({}): up={}, down={}, total={}",
                inbound.remark,
                tag,
                new_up,
                new_down,
                inbound.total
            );
        }
    }

    if needs_reapply {
        if let Err(e) = xray_service::apply_config(pool, monitor).await {
            tracing::error!("Failed to reapply config after quota reached: {}", e);
        }
    }

    Ok(())
}

async fn query_all_xray_stats(xray_bin: &str) -> ApiResult<std::collections::HashMap<String, i64>> {
    let output = Command::new(xray_bin)
        .arg("api")
        .arg("statsquery")
        .arg("--server=127.0.0.1:10085")
        .arg("--pattern=")
        .arg("--reset=true")
        .output()
        .await
        .map_err(|e| {
            crate::errors::ApiError::SystemError(format!("Xray API call failed: {}", e))
        })?;

    if !output.status.success() {
        let err = String::from_utf8_lossy(&output.stderr);
        tracing::error!("Xray API error: {}", err);
        return Ok(std::collections::HashMap::new());
    }

    let stdout = String::from_utf8_lossy(&output.stdout);

    let preview = if stdout.len() > 500 {
        &stdout[..500]
    } else {
        &stdout[..]
    };
    tracing::info!("Xray API raw output preview: {}", preview);

    let mut stats = std::collections::HashMap::new();
    let mut current_name: Option<String> = None;
    let mut current_value: Option<i64> = None;

    for line in stdout.lines() {
        let line = line.trim();

        if line.starts_with("}") {
            if let (Some(name), Some(value)) = (&current_name, current_value) {
                stats.insert(name.clone(), value);
            }
            current_name = None;
            current_value = None;
        }

        if line.contains("name") {
            let parts: Vec<&str> = line.split('"').collect();
            if parts.len() >= 4 {
                current_name = Some(parts[3].to_string());
            }
        }

        if line.contains("value") {
            if let Some(part) = line.split("value").nth(1) {
                let num_str: String = part.chars().filter(|c| c.is_ascii_digit()).collect();
                if let Ok(value) = num_str.parse::<i64>() {
                    current_value = Some(value);
                }
            }
        }
    }

    tracing::info!(
        "Parser completed. Total unique keys in map: {}, checking for duplicates...",
        stats.len()
    );
    for (key, val) in stats.iter().take(5) {
        tracing::info!("Sample entry: {} = {}", key, val);
    }

    Ok(stats)
}
