use crate::middleware::auth::AuthUser;
use axum::extract::{Json, State};

use crate::{
    errors::ApiResult,
    services::system_service::{self, SharedMonitor},
    utils::response::ApiResponse,
};

pub async fn get_sys_stats(
    State(monitor): State<SharedMonitor>,
    _user: AuthUser,
) -> ApiResult<ApiResponse<system_service::SysStats>> {
    let stats = monitor
        .lock()
        .map_err(|e| crate::errors::ApiError::SystemError(format!("Monitor lock poisoned: {}", e)))?
        .get_system_stats()?;
    Ok(ApiResponse::success(stats))
}

pub async fn restart_xray(
    State(monitor): State<SharedMonitor>,
    _user: AuthUser,
) -> ApiResult<ApiResponse<()>> {
    system_service::restart_xray(monitor).await?;
    Ok(ApiResponse::success_no_data("Xray service restarted"))
}

pub async fn restart_panel(_user: AuthUser) -> ApiResult<ApiResponse<()>> {
    system_service::restart_panel().await?;
    Ok(ApiResponse::success_no_data("Panel restart command sent"))
}

pub async fn stop_xray(
    State(monitor): State<SharedMonitor>,
    _user: AuthUser,
) -> ApiResult<ApiResponse<()>> {
    system_service::stop_xray(monitor).await?;
    Ok(ApiResponse::success_no_data("Xray service stopped"))
}

pub async fn start_xray(
    State(monitor): State<SharedMonitor>,
    _user: AuthUser,
) -> ApiResult<ApiResponse<()>> {
    system_service::start_xray(monitor).await?;
    Ok(ApiResponse::success_no_data("Xray service started"))
}

pub async fn update_xray(
    State(monitor): State<SharedMonitor>,
    _user: AuthUser,
    Json(req): Json<system_service::UpdateXrayRequest>,
) -> ApiResult<ApiResponse<()>> {
    system_service::update_xray(monitor, req.version).await?;
    Ok(ApiResponse::success_no_data("Xray update started"))
}

pub async fn apply_config(
    State(monitor): State<SharedMonitor>,
    axum::Extension(pool): axum::Extension<sqlx::SqlitePool>,
    _user: AuthUser,
) -> ApiResult<ApiResponse<()>> {
    crate::services::xray_service::apply_config(&pool, monitor).await?;
    Ok(ApiResponse::success_no_data(
        "Xray config applied and service restarted",
    ))
}

pub async fn get_xray_releases(_user: AuthUser) -> ApiResult<ApiResponse<Vec<String>>> {
    let releases = system_service::get_xray_releases().await?;
    Ok(ApiResponse::success(releases))
}

pub async fn get_logs(_user: AuthUser) -> ApiResult<ApiResponse<Vec<String>>> {
    let logs = system_service::get_logs().await?;
    Ok(ApiResponse::success(logs))
}

pub async fn export_db(_user: AuthUser) -> impl axum::response::IntoResponse {
    use axum::body::Body;
    use axum::http::{header, StatusCode};
    use axum::response::IntoResponse;

    let db_path = "data/x-ui.db";

    match tokio::fs::read(db_path).await {
        Ok(contents) => {
            let filename = format!(
                "x-ui_backup_{}.db",
                chrono::Local::now().format("%Y%m%d_%H%M%S")
            );
            (
                StatusCode::OK,
                [
                    (header::CONTENT_TYPE, "application/octet-stream"),
                    (
                        header::CONTENT_DISPOSITION,
                        &format!("attachment; filename=\"{}\"", filename),
                    ),
                ],
                Body::from(contents),
            )
                .into_response()
        }
        Err(_) => (StatusCode::NOT_FOUND, "Database file not found").into_response(),
    }
}

pub async fn import_db(
    _user: AuthUser,
    mut multipart: axum::extract::Multipart,
) -> ApiResult<ApiResponse<()>> {
    while let Some(field) = multipart
        .next_field()
        .await
        .map_err(|e| crate::errors::ApiError::InternalError(format!("Multipart error: {}", e)))?
    {
        let name = field.name().unwrap_or("").to_string();
        if name == "db" {
            let data = field.bytes().await.map_err(|e| {
                crate::errors::ApiError::InternalError(format!(
                    "Failed to read multipart data: {}",
                    e
                ))
            })?;

            let db_path = "data/x-ui.db";
            let backup_path = "data/x-ui.db.bak";
            if tokio::fs::metadata(db_path).await.is_ok() {
                tokio::fs::copy(db_path, backup_path).await.map_err(|e| {
                    crate::errors::ApiError::InternalError(format!(
                        "Failed to backup database: {}",
                        e
                    ))
                })?;
            }

            tokio::fs::write(db_path, data).await.map_err(|e| {
                crate::errors::ApiError::InternalError(format!(
                    "Failed to write database file: {}",
                    e
                ))
            })?;

            return Ok(ApiResponse::success_no_data(
                "Database imported successfully. Please restart the panel to apply changes.",
            ));
        }
    }

    Err(crate::errors::ApiError::BadRequest(
        "No 'db' field found in request".to_string(),
    ))
}

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateConfigReq {
    pub web_root: String,
    pub port: u16,
}

pub async fn update_config(
    _user: AuthUser,
    Json(req): Json<UpdateConfigReq>,
) -> ApiResult<ApiResponse<()>> {
    let env_path_str = if std::path::Path::new("/usr/local/x-ui/.env").exists() {
        "/usr/local/x-ui/.env"
    } else {
        ".env"
    };
    let env_path = std::path::Path::new(env_path_str);

    let content = tokio::fs::read_to_string(env_path)
        .await
        .unwrap_or_default();

    let mut clean_root = req.web_root.trim().to_string();
    if !clean_root.starts_with('/') {
        clean_root = format!("/{}", clean_root);
    }
    if !clean_root.ends_with('/') && clean_root != "/" {
        clean_root = format!("{}/", clean_root);
    }

    let mut new_lines = Vec::new();
    let mut has_port = false;
    let mut has_root = false;

    for line in content.lines() {
        if line.starts_with("SERVER_PORT=") {
            new_lines.push(format!("SERVER_PORT={}", req.port));
            has_port = true;
        } else if line.starts_with("WEB_ROOT=") {
            new_lines.push(format!("WEB_ROOT={}", clean_root));
            has_root = true;
        } else {
            new_lines.push(line.to_string());
        }
    }

    if !has_port {
        new_lines.push(format!("SERVER_PORT={}", req.port));
    }
    if !has_root {
        new_lines.push(format!("WEB_ROOT={}", clean_root));
    }

    let new_content = new_lines.join("\n");
    if let Err(e) = tokio::fs::write(env_path, new_content).await {
        return Err(crate::errors::ApiError::InternalError(format!(
            "Failed to write .env: {}",
            e
        )));
    }

    Ok(ApiResponse::success_no_data("Config updated"))
}
