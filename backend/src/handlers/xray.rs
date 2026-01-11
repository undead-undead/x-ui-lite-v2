use axum::{http::StatusCode, Json};
use rand_core::OsRng;
use serde::{Deserialize, Serialize};
use x25519_dalek::{StaticSecret, PublicKey};
use base64::{Engine as _, engine::general_purpose::URL_SAFE_NO_PAD};

#[derive(Debug, Serialize, Deserialize)]
pub struct RealityKeysResponse {
    pub private_key: String,
    pub public_key: String,
}

pub async fn generate_reality_keys() -> Result<Json<RealityKeysResponse>, StatusCode> {
    // Generate random private key
    let private_key = StaticSecret::random_from_rng(OsRng);
    let public_key = PublicKey::from(&private_key);

    // Encode to base64 (URL-safe, no padding - standard for Xray)
    let private_key_b64 = URL_SAFE_NO_PAD.encode(private_key.to_bytes());
    let public_key_b64 = URL_SAFE_NO_PAD.encode(public_key.as_bytes());

    Ok(Json(RealityKeysResponse {
        private_key: private_key_b64,
        public_key: public_key_b64,
    }))
}
