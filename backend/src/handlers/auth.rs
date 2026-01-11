use axum::{extract::State, Json};
use sqlx::SqlitePool;

use crate::{
    errors::ApiResult,
    middleware::auth::AuthUser,
    models::user::{ChangePasswordRequest, LoginRequest, LoginResponse},
    services::auth_service,
    utils::response::ApiResponse,
};

pub async fn login(
    State(pool): State<SqlitePool>,
    Json(req): Json<LoginRequest>,
) -> ApiResult<ApiResponse<LoginResponse>> {
    let response = auth_service::login(&pool, req).await?;
    Ok(ApiResponse::success_with_msg(response, "Login successful"))
}

pub async fn logout(_user: AuthUser) -> ApiResult<ApiResponse<()>> {
    Ok(ApiResponse::success_no_data("Logout successful"))
}

pub async fn change_password(
    State(pool): State<SqlitePool>,
    user: AuthUser,
    Json(req): Json<ChangePasswordRequest>,
) -> ApiResult<ApiResponse<()>> {
    auth_service::change_password(&pool, user.user_id, req).await?;
    Ok(ApiResponse::success_no_data(
        "Password changed successfully",
    ))
}

pub async fn verify(user: AuthUser) -> ApiResult<ApiResponse<AuthUser>> {
    Ok(ApiResponse::success(user))
}

pub async fn update_credentials(
    State(pool): State<SqlitePool>,
    Json(req): Json<crate::models::user::UpdateCredentialsRequest>,
) -> ApiResult<ApiResponse<()>> {
    auth_service::update_credentials(&pool, req).await?;
    Ok(ApiResponse::success_no_data(
        "Credentials updated successfully",
    ))
}
