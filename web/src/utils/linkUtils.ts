import type { Inbound } from '../types/inbound';

export function generateShareLink(inbound: Inbound, serverAddr: string = window.location.hostname): string {
    const { protocol, settings, streamSettings, remark } = inbound;
    const urlRemark = encodeURIComponent(remark);

    if (protocol === 'vless') {
        const uuid = settings?.clients?.[0]?.id || '';
        const flow = settings?.clients?.[0]?.flow || '';
        const port = inbound.port;
        const params = new URLSearchParams();

        if (streamSettings) {
            params.set('type', streamSettings.network || 'tcp');
            params.set('security', streamSettings.security || 'none');

            if (flow) params.set('flow', flow);

            if (streamSettings.security === 'reality') {
                const rs = streamSettings.realitySettings;
                if (rs) {
                    params.set('sni', rs.serverNames?.[0] || '');
                    params.set('fp', rs.fingerprint || 'chrome');
                    params.set('pbk', rs.publicKey || '');
                    params.set('sid', rs.shortIds?.[0] || '');
                }
            } else if (streamSettings.security === 'tls') {
                params.set('sni', streamSettings.tlsSettings?.serverName || '');
            }

            if (streamSettings.network === 'ws') {
                params.set('path', streamSettings.wsSettings?.path || '/');
                params.set('host', streamSettings.wsSettings?.headers?.Host || '');
            } else if (streamSettings.network === 'grpc') {
                params.set('serviceName', streamSettings.grpcSettings?.serviceName || '');
            } else if (streamSettings.network === 'xhttp') {
                const xhttp = streamSettings.xhttpSettings;
                if (xhttp) {
                    if (xhttp.path) params.set('path', xhttp.path);
                    if (xhttp.host) params.set('host', xhttp.host);
                    if (xhttp.mode) params.set('mode', xhttp.mode);
                }
            }
        }

        return `vless://${uuid}@${serverAddr}:${port}?${params.toString()}#${urlRemark}`;
    }

    if (protocol === 'trojan') {
        const password = settings?.clients?.[0]?.password || '';
        const port = inbound.port;
        const params = new URLSearchParams();

        if (streamSettings) {
            params.set('security', streamSettings.security || 'tls');
            params.set('type', streamSettings.network || 'tcp');
            params.set('sni', streamSettings.tlsSettings?.serverName || '');

            if (streamSettings.network === 'ws') {
                params.set('path', streamSettings.wsSettings?.path || '/');
                params.set('host', streamSettings.wsSettings?.headers?.Host || '');
            } else if (streamSettings.network === 'grpc') {
                params.set('serviceName', streamSettings.grpcSettings?.serviceName || '');
            } else if (streamSettings.network === 'xhttp') {
                const xhttp = streamSettings.xhttpSettings;
                if (xhttp) {
                    if (xhttp.path) params.set('path', xhttp.path);
                    if (xhttp.host) params.set('host', xhttp.host);
                    if (xhttp.mode) params.set('mode', xhttp.mode);
                }
            }
        }

        return `trojan://${password}@${serverAddr}:${port}?${params.toString()}#${urlRemark}`;
    }

    return '';
}

export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch (err) {
        console.warn('Navigator clipboard failed, trying fallback:', err);
    }

    try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        document.body.appendChild(textarea);

        textarea.focus();
        textarea.select();

        const success = document.execCommand('copy');
        document.body.removeChild(textarea);

        if (success) {
            return true;
        } else {
            console.error('Fallback execCommand failed');
            return false;
        }
    } catch (err) {
        console.error('Fallback copy failed:', err);
        return false;
    }
}
