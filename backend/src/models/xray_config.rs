use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct XrayConfig {
    pub log: LogConfig,
    pub api: ApiConfig,
    pub dns: Option<DnsConfig>,
    pub stats: Option<StatsConfig>,
    pub policy: Option<PolicyConfig>,
    pub inbounds: Vec<InboundConfig>,
    pub outbounds: Vec<OutboundConfig>,
    pub routing: Option<RoutingConfig>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LogConfig {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub access: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
    pub loglevel: String,
}

impl Default for LogConfig {
    fn default() -> Self {
        Self {
            access: None,
            error: None,
            loglevel: "warning".to_string(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct ApiConfig {
    pub tag: String,
    pub services: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct DnsConfig {
    pub servers: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct StatsConfig {}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct PolicyConfig {
    pub levels: HashMap<String, LevelPolicy>,
    pub system: Option<SystemPolicy>,
}

#[derive(Debug, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct LevelPolicy {
    #[serde(default)]
    pub stats_user_uplink: bool,
    #[serde(default)]
    pub stats_user_downlink: bool,
    #[serde(default)]
    pub handshake: u32,
    #[serde(default)]
    pub conn_idle: u32,
    #[serde(default)]
    pub uplink_only: u32,
    #[serde(default)]
    pub downlink_only: u32,
    #[serde(default)]
    pub buffer_size: u32,
}

#[derive(Debug, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SystemPolicy {
    #[serde(default)]
    pub stats_inbound_uplink: bool,
    #[serde(default)]
    pub stats_inbound_downlink: bool,
    #[serde(default)]
    pub stats_outbound_uplink: bool,
    #[serde(default)]
    pub stats_outbound_downlink: bool,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InboundConfig {
    pub tag: String,
    pub port: i32,
    pub protocol: String,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub listen: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub allocate: Option<serde_json::Value>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub settings: Option<serde_json::Value>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub stream_settings: Option<serde_json::Value>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub sniffing: Option<serde_json::Value>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OutboundConfig {
    pub tag: String,
    pub protocol: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub settings: Option<serde_json::Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stream_settings: Option<serde_json::Value>,
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct RoutingConfig {
    pub domain_strategy: String,
    pub rules: Vec<RoutingRule>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RoutingRule {
    #[serde(rename = "type")]
    pub rule_type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub port: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub inbound_tag: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub outbound_tag: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ip: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub domain: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub protocol: Option<Vec<String>>,
}
