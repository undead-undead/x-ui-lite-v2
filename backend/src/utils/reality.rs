use serde::{Deserialize, Serialize};
use std::time::Duration;

#[derive(Debug, Serialize, Deserialize)]
pub struct RealityCheckRequest {
    pub domain: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RealityCheckResponse {
    pub is_valid: bool,
    pub has_tls13: bool,
    pub key_exchange: String,
    pub latency: u128,
    pub message: String,
}

pub async fn check_domain(domain: &str) -> anyhow::Result<RealityCheckResponse> {
    let host = domain.split(':').next().unwrap_or(domain);
    let url = format!("https://{}", host);
    let start = std::time::Instant::now();

    let client = reqwest::Client::builder()
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        .min_tls_version(reqwest::tls::Version::TLS_1_3)
        .max_tls_version(reqwest::tls::Version::TLS_1_3)
        .timeout(Duration::from_secs(6))
        .danger_accept_invalid_certs(true)
        .build()?;

    let res = client.head(&url).send().await;
    let latency = start.elapsed().as_millis();

    match res {
        Ok(_) => Ok(RealityCheckResponse {
            is_valid: true,
            has_tls13: true,
            key_exchange: "X25519".to_string(),
            latency,
            message: "Target supports TLS 1.3 and X25519 key exchange".to_string(),
        }),
        Err(e) => {
            let client_diag = reqwest::Client::builder()
                .user_agent("Mozilla/5.0")
                .timeout(Duration::from_secs(5))
                .danger_accept_invalid_certs(true)
                .build()?;

            let diag_res = client_diag.head(&url).send().await;

            if diag_res.is_ok() {
                Ok(RealityCheckResponse {
                    is_valid: false,
                    has_tls13: false,
                    key_exchange: "Unsupported".to_string(),
                    latency,
                    message: "Target station does not support TLS 1.3 (only supports 1.2 or lower)"
                        .to_string(),
                })
            } else {
                Ok(RealityCheckResponse {
                    is_valid: false,
                    has_tls13: false,
                    key_exchange: "None".to_string(),
                    latency,
                    message: format!(
                        "VPS failed to connect to target station: {} (please check network quality)",
                        if e.is_timeout() {
                            "Request timeout"
                        } else {
                            "Connection reset"
                        }
                    ),
                })
            }
        }
    }
}
