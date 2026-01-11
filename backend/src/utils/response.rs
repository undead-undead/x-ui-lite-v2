use axum::{response::IntoResponse, Json};
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub msg: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub obj: Option<T>,
}

impl<T: Serialize> ApiResponse<T> {
    pub fn success(data: T) -> Self {
        Self {
            success: true,
            msg: "Success".to_string(),
            obj: Some(data),
        }
    }

    pub fn success_with_msg(data: T, msg: impl Into<String>) -> Self {
        Self {
            success: true,
            msg: msg.into(),
            obj: Some(data),
        }
    }
}

impl ApiResponse<()> {
    pub fn success_no_data(msg: impl Into<String>) -> Self {
        Self {
            success: true,
            msg: msg.into(),
            obj: None,
        }
    }
}

impl<T: Serialize> IntoResponse for ApiResponse<T> {
    fn into_response(self) -> axum::response::Response {
        Json(self).into_response()
    }
}

#[macro_export]
macro_rules! ok {
    ($data:expr) => {
        Ok($crate::utils::response::ApiResponse::success($data))
    };
    ($data:expr, $msg:expr) => {
        Ok($crate::utils::response::ApiResponse::success_with_msg(
            $data, $msg,
        ))
    };
}

#[macro_export]
macro_rules! ok_msg {
    ($msg:expr) => {
        Ok($crate::utils::response::ApiResponse::success_no_data($msg))
    };
}
