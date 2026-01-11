use sqlx::SqlitePool;

use crate::{
    errors::{ApiError, ApiResult},
    models::user::{ChangePasswordRequest, LoginRequest, LoginResponse, User},
    utils::{jwt, password, validation},
};

pub async fn init_default_admin(pool: &SqlitePool) -> ApiResult<()> {
    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = 1")
        .fetch_optional(pool)
        .await?;

    if let Some(user) = user {
        if user.password_hash == "temporary" {
            let hashed = password::hash_password("admin")?;
            sqlx::query("UPDATE users SET password_hash = ? WHERE id = 1")
                .bind(&hashed)
                .execute(pool)
                .await?;
            tracing::info!("Default admin password initialized to: admin");
        }
    }

    Ok(())
}

pub async fn reset_admin(pool: &SqlitePool) -> ApiResult<()> {
    let hashed = password::hash_password("admin")?;
    sqlx::query("UPDATE users SET username = 'admin', password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1")
        .bind(&hashed)
        .execute(pool)
        .await?;

    tracing::info!("Admin credentials has been reset to admin/admin");
    Ok(())
}

pub async fn login(pool: &SqlitePool, req: LoginRequest) -> ApiResult<LoginResponse> {
    validation::validate_username(&req.username)?;
    validation::validate_password(&req.password)?;

    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE username = ?")
        .bind(&req.username)
        .fetch_optional(pool)
        .await?
        .ok_or_else(|| ApiError::Unauthorized("Invalid username or password".to_string()))?;

    let is_valid = password::verify_password(&req.password, &user.password_hash)?;

    if !is_valid {
        return Err(ApiError::Unauthorized(
            "Invalid username or password".to_string(),
        ));
    }

    let token = jwt::generate_token(user.id, &user.username, user.password_version)?;

    Ok(LoginResponse {
        token,
        username: user.username,
    })
}

pub async fn change_password(
    pool: &SqlitePool,
    user_id: i64,
    req: ChangePasswordRequest,
) -> ApiResult<()> {
    validation::validate_username(&req.new_username)?;
    validation::validate_password(&req.old_password)?;
    validation::validate_password(&req.new_password)?;

    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = ?")
        .bind(user_id)
        .fetch_one(pool)
        .await?;

    let is_valid = password::verify_password(&req.old_password, &user.password_hash)?;

    if !is_valid {
        return Err(ApiError::Unauthorized("Invalid old password".to_string()));
    }

    let new_hash = password::hash_password(&req.new_password)?;

    sqlx::query(
        "UPDATE users 
         SET username = ?, 
             password_hash = ?, 
             password_version = password_version + 1,
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?",
    )
    .bind(&req.new_username)
    .bind(&new_hash)
    .bind(user_id)
    .execute(pool)
    .await?;

    tracing::info!(
        "Password changed for user_id: {}, password version incremented, all old tokens invalidated",
        user_id
    );

    Ok(())
}

pub async fn update_credentials(
    pool: &SqlitePool,
    req: crate::models::user::UpdateCredentialsRequest,
) -> ApiResult<()> {
    tracing::debug!(
        "Updating credentials: old_user={}, new_user={}",
        req.old_username,
        req.new_username
    );

    validation::validate_username(&req.old_username)?;
    validation::validate_username(&req.new_username)?;
    validation::validate_password(&req.old_password)?;
    validation::validate_password(&req.new_password)?;

    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE username = ?")
        .bind(&req.old_username)
        .fetch_optional(pool)
        .await?
        .ok_or_else(|| ApiError::Unauthorized("Old username or password incorrect".to_string()))?;

    let is_valid = password::verify_password(&req.old_password, &user.password_hash)?;

    if !is_valid {
        return Err(ApiError::Unauthorized(
            "Old username or password incorrect".to_string(),
        ));
    }

    let new_hash = password::hash_password(&req.new_password)?;

    sqlx::query(
        "UPDATE users 
         SET username = ?, 
             password_hash = ?, 
             password_version = password_version + 1,
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?",
    )
    .bind(&req.new_username)
    .bind(&new_hash)
    .bind(user.id)
    .execute(pool)
    .await?;

    tracing::info!(
        "User credentials updated successfully: {} -> {}",
        req.old_username,
        req.new_username
    );

    Ok(())
}
