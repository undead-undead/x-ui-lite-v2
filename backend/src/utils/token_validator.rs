use crate::{
    errors::{ApiError, ApiResult},
    utils::jwt::Claims,
};
use sqlx::SqlitePool;

pub async fn validate_token_freshness(pool: &SqlitePool, claims: &Claims) -> ApiResult<()> {
    let user_id = claims
        .sub
        .parse::<i64>()
        .map_err(|_| ApiError::Unauthorized("Invalid user ID in token".to_string()))?;

    let result: Option<(i64,)> = sqlx::query_as("SELECT password_version FROM users WHERE id = ?")
        .bind(user_id)
        .fetch_optional(pool)
        .await?;

    let db_password_version = result
        .ok_or_else(|| {
            tracing::warn!("Token validation failed: user {} not found", user_id);
            ApiError::Unauthorized("User not found".to_string())
        })?
        .0;

    if claims.password_version != db_password_version {
        tracing::warn!(
            "Token invalidated for user {}: password changed (token version: {}, db version: {})",
            user_id,
            claims.password_version,
            db_password_version
        );
        return Err(ApiError::Unauthorized(
            "Token has been invalidated due to password change".to_string(),
        ));
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    #[tokio::test]
    #[ignore]
    async fn test_validate_token_freshness() {}
}
