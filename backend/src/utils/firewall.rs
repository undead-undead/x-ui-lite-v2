use std::process::Command;
use tracing::info;

pub fn open_port(port: u16) {
    info!("Attempting to open firewall port: {}", port);

    if is_command_available("ufw") {
        let output = Command::new("ufw")
            .args(["allow", &format!("{}/tcp", port)])
            .output();
        if let Ok(out) = output {
            if out.status.success() {
                info!("UFW: TCP port {} allowed", port);
            }
        }
        let _ = Command::new("ufw")
            .args(["allow", &format!("{}/udp", port)])
            .output();
    }

    if is_command_available("firewall-cmd") {
        let success = Command::new("firewall-cmd")
            .args(["--permanent", &format!("--add-port={}/tcp", port)])
            .status();
        if let Ok(status) = success {
            if status.success() {
                let _ = Command::new("firewall-cmd")
                    .arg("--permanent")
                    .arg(&format!("--add-port={}/udp", port))
                    .status();
                let _ = Command::new("firewall-cmd").arg("--reload").status();
                info!("Firewalld: port {} allowed", port);
            }
        }
    }

    if is_command_available("iptables") {
        let _ = Command::new("iptables")
            .args([
                "-I",
                "INPUT",
                "-p",
                "tcp",
                "--dport",
                &port.to_string(),
                "-j",
                "ACCEPT",
            ])
            .status();
        let _ = Command::new("iptables")
            .args([
                "-I",
                "INPUT",
                "-p",
                "udp",
                "--dport",
                &port.to_string(),
                "-j",
                "ACCEPT",
            ])
            .status();
        info!("Iptables: port {} allowed", port);
    }
}

fn is_command_available(cmd: &str) -> bool {
    Command::new("which")
        .arg(cmd)
        .output()
        .map(|o| o.status.success())
        .unwrap_or(false)
}
