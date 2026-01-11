// src/errors/mod.rs

use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct ErrorResponse {
    pub success: bool,
    pub msg: String,
}

#[derive(Debug, thiserror::Error)]
pub enum ApiError {
    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),

    #[error("Authentication failed: {0}")]
    Unauthorized(String),

    #[error("Invalid input: {0}")]
    BadRequest(String),

    #[error("Internal server error: {0}")]
    InternalError(String),

    #[error("JWT error: {0}")]
    JwtError(#[from] jsonwebtoken::errors::Error),

    #[error("Password hashing error")]
    PasswordHashError,

    #[error("System error: {0}")]
    SystemError(String),
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            ApiError::Database(ref e) => {
                tracing::error!("Database error: {:?}", e);
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Database error".to_string(),
                )
            }
            ApiError::Unauthorized(ref msg) => (StatusCode::UNAUTHORIZED, msg.clone()),
            ApiError::BadRequest(ref msg) => (StatusCode::BAD_REQUEST, msg.clone()),
            ApiError::InternalError(ref msg) => {
                tracing::error!("Internal error: {}", msg);
                (StatusCode::INTERNAL_SERVER_ERROR, msg.clone())
            }
            ApiError::JwtError(ref e) => {
                tracing::error!("JWT error: {:?}", e);
                (StatusCode::UNAUTHORIZED, "Invalid token".to_string())
            }
            ApiError::PasswordHashError => {
                tracing::error!("Password hashing failed");
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Authentication error".to_string(),
                )
            }
            ApiError::SystemError(ref msg) => {
                tracing::error!("System error: {}", msg);
                (StatusCode::INTERNAL_SERVER_ERROR, msg.clone())
            }
        };

        let body = Json(ErrorResponse {
            success: false,
            msg: message,
        });

        (status, body).into_response()
    }
}

pub type ApiResult<T> = Result<T, ApiError>;
