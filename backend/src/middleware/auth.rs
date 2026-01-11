use axum::{
    extract::{Request, State},
    http::StatusCode,
    middleware::Next,
    response::Response,
};
use sqlx::SqlitePool;

use crate::utils::{jwt, token_validator};

pub async fn auth_middleware(
    State(pool): State<SqlitePool>,
    mut req: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let token = req
        .headers()
        .get("Authorization")
        .and_then(|h| h.to_str().ok())
        .and_then(|h| h.strip_prefix("Bearer "))
        .ok_or(StatusCode::UNAUTHORIZED)?;

    let claims = jwt::verify_token(token).map_err(|_| StatusCode::UNAUTHORIZED)?;

    token_validator::validate_token_freshness(&pool, &claims)
        .await
        .map_err(|e| {
            tracing::warn!("Token validation failed: {:?}", e);
            StatusCode::UNAUTHORIZED
        })?;

    req.extensions_mut().insert(claims);

    Ok(next.run(req).await)
}

use axum::extract::FromRequestParts;
use axum::http::request::Parts;
use serde::Serialize;

#[derive(Serialize)]
pub struct AuthUser {
    pub user_id: i64,
    pub username: String,
}

#[axum::async_trait]
impl<S> FromRequestParts<S> for AuthUser
where
    S: Send + Sync,
{
    type Rejection = StatusCode;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let claims = parts
            .extensions
            .get::<crate::utils::jwt::Claims>()
            .ok_or(StatusCode::UNAUTHORIZED)?;

        let user_id = claims
            .sub
            .parse::<i64>()
            .map_err(|_| StatusCode::UNAUTHORIZED)?;

        Ok(AuthUser {
            user_id,
            username: claims.username.clone(),
        })
    }
}
