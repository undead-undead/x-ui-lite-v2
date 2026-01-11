use axum::{http::StatusCode, Json};
use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Debug, Serialize, Deserialize)]
pub struct RealityKeysResponse {
    pub private_key: String,
    pub public_key: String,
}

pub async fn generate_reality_keys() -> Result<Json<RealityKeysResponse>, StatusCode> {
    let xray_bin =
        std::env::var("XRAY_BIN_PATH").unwrap_or_else(|_| "/usr/local/x-ui/bin/xray".to_string());

    let output = Command::new(&xray_bin)
        .arg("x25519")
        .output()
        .map_err(|e| {
            tracing::error!("Failed to execute xray x25519: {}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    if !output.status.success() {
        tracing::error!(
            "xray x25519 failed: {}",
            String::from_utf8_lossy(&output.stderr)
        );
        return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }

    let stdout = String::from_utf8_lossy(&output.stdout);

    tracing::info!("xray x25519 output: {}", stdout);

    let mut private_key = String::new();
    let mut public_key = String::new();

    for line in stdout.lines() {
        let trimmed = line.trim();
        if trimmed.starts_with("PrivateKey:") || trimmed.starts_with("Private key:") {
            private_key = trimmed.split(':').nth(1).unwrap_or("").trim().to_string();
        } else if trimmed.starts_with("Password:") || trimmed.starts_with("Public key:") {
            public_key = trimmed.split(':').nth(1).unwrap_or("").trim().to_string();
        }
    }

    if private_key.is_empty() || public_key.is_empty() {
        tracing::error!(
            "Failed to parse xray x25519 output. Private: '{}', Public: '{}'",
            private_key,
            public_key
        );
        tracing::error!("Raw output was: {}", stdout);
        return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }

    Ok(Json(RealityKeysResponse {
        private_key,
        public_key,
    }))
}
