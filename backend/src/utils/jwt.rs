use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use std::env;

use crate::errors::ApiError;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub username: String,
    pub password_version: i64,
    pub exp: i64,
    pub iat: i64,
}

pub fn generate_token(
    user_id: i64,
    username: &str,
    password_version: i64,
) -> Result<String, ApiError> {
    let secret = env::var("JWT_SECRET").unwrap_or_else(|_| "default-secret-key".to_string());

    let expiration_hours = env::var("JWT_EXPIRATION_HOURS")
        .unwrap_or_else(|_| "24".to_string())
        .parse::<i64>()
        .unwrap_or(24);

    let now = Utc::now();
    let exp = (now + Duration::hours(expiration_hours)).timestamp();

    let claims = Claims {
        sub: user_id.to_string(),
        username: username.to_string(),
        password_version,
        exp,
        iat: now.timestamp(),
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )?;

    Ok(token)
}

pub fn verify_token(token: &str) -> Result<Claims, ApiError> {
    let secret = env::var("JWT_SECRET").unwrap_or_else(|_| "default-secret-key".to_string());

    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &Validation::default(),
    )?;

    Ok(token_data.claims)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_token_generation_and_verification() {
        let password_version = 1;
        let token = generate_token(1, "admin", password_version).unwrap();
        let claims = verify_token(&token).unwrap();

        assert_eq!(claims.sub, "1");
        assert_eq!(claims.username, "admin");
        assert_eq!(claims.password_version, password_version);
    }
}
