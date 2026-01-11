use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, FromRow, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Inbound {
    pub id: String,
    pub remark: String,
    pub protocol: String,
    pub port: i32,
    pub enable: bool,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub tag: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub listen: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub allocate: Option<String>,

    pub settings: Option<String>,
    pub stream_settings: Option<String>,
    pub sniffing: Option<String>,
    pub up: i64,
    pub down: i64,
    pub total: i64,
    pub expiry: i64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_at: Option<NaiveDateTime>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<NaiveDateTime>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateInboundRequest {
    pub id: Option<String>,
    pub remark: String,
    pub protocol: String,
    pub port: i32,
    pub enable: Option<bool>,

    pub tag: Option<String>,
    pub listen: Option<String>,
    pub allocate: Option<serde_json::Value>,

    pub settings: Option<serde_json::Value>,
    pub stream_settings: Option<serde_json::Value>,
    pub sniffing: Option<serde_json::Value>,
    pub total: Option<i64>,
    pub expiry: Option<i64>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateInboundRequest {
    pub id: String,
    pub remark: Option<String>,
    pub protocol: Option<String>,
    pub port: Option<i32>,
    pub enable: Option<bool>,

    pub tag: Option<String>,
    pub listen: Option<String>,
    pub allocate: Option<serde_json::Value>,

    pub settings: Option<serde_json::Value>,
    pub stream_settings: Option<serde_json::Value>,
    pub sniffing: Option<serde_json::Value>,
    pub total: Option<i64>,
    pub expiry: Option<i64>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DeleteInboundRequest {
    pub id: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ResetTrafficRequest {
    pub id: String,
}
