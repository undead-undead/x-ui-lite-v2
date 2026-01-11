use crate::errors::ApiError;
use regex::Regex;
use std::sync::LazyLock;

static USERNAME_REGEX: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"^[a-zA-Z0-9_-]+$").expect("Invalid username regex pattern"));

pub fn validate_username(username: &str) -> Result<(), ApiError> {
    if username.len() < 3 || username.len() > 32 {
        return Err(ApiError::BadRequest(
            "Username must be between 3 and 32 characters".to_string(),
        ));
    }

    if !USERNAME_REGEX.is_match(username) {
        return Err(ApiError::BadRequest(
            "Username can only contain letters, numbers, underscores, and hyphens".to_string(),
        ));
    }

    Ok(())
}

pub fn validate_password(password: &str) -> Result<(), ApiError> {
    if password.len() < 4 {
        return Err(ApiError::BadRequest(
            "Password must be at least 4 characters".to_string(),
        ));
    }

    if password.len() > 128 {
        return Err(ApiError::BadRequest(
            "Password cannot exceed 128 characters".to_string(),
        ));
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validate_username() {
        assert!(validate_username("admin").is_ok());
        assert!(validate_username("user_123").is_ok());
        assert!(validate_username("test-user").is_ok());

        assert!(validate_username("ab").is_err());
        assert!(validate_username("a".repeat(33).as_str()).is_err());
        assert!(validate_username("user@123").is_err());
        assert!(validate_username("user 123").is_err());
    }

    #[test]
    fn test_validate_password() {
        assert!(validate_password("1234").is_ok());
        assert!(validate_password("admin").is_ok());
        assert!(validate_password("password123").is_ok());

        assert!(validate_password("123").is_err());
        assert!(validate_password(&"a".repeat(129)).is_err());
    }
}
