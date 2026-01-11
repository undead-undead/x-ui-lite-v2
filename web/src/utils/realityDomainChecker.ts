import { inboundApi } from '../api/inbound';

export interface DomainCheckResult {
    isValid: boolean;
    message: string;
    details?: string;
    score?: number;
    warning?: string;
}

const PREMIUM_DOMAINS = [
    'microsoft.com',
    'apple.com',
    'cisco.com',
    'icloud.com',
    'azure.microsoft.com',
    'raw.githubusercontent.com',
    'amazon.com',
    'cloudflare.com',
    'steamcommunity.com'
];

function isValidDomainFormat(domain: string): boolean {
    const pattern = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,6}$/i;
    return pattern.test(domain);
}

function checkDomainRisk(domain: string): { isRisk: boolean; reason?: string; penalty: number } {
    const d = domain.toLowerCase();

    if (d.endsWith('.cn') || d.includes('baidu.com') || d.includes('qq.com') || d.includes('gov.cn')) {
        return { isRisk: true, penalty: 40, reason: 'Region restriction: Mainland China domain detected.' };
    }

    if (d.includes('.gov') || d.includes('.edu')) {
        return { isRisk: true, penalty: 20, reason: 'Sensitive institution: Government or educational domains are monitored.' };
    }

    const highRiskRegions = ['.ru', '.ir', '.kp', '.sy'];
    if (highRiskRegions.some(r => d.endsWith(r))) {
        return { isRisk: true, penalty: 25, reason: 'Regional risk: This area is highly monitored.' };
    }

    const contentRisks = ['pornhub', 'gambling', 'casino', 'bet'];
    if (contentRisks.some(r => d.includes(r))) {
        return { isRisk: true, penalty: 50, reason: 'Content risk: These sites may be blocked in many environments.' };
    }

    const financePatterns = ['bank', 'paypal', 'stripe', 'visa', 'mastercard', 'chase'];
    if (financePatterns.some(p => d.includes(p))) {
        return { isRisk: true, penalty: 30, reason: 'Behavior risk: Financial domain detected.' };
    }

    return { isRisk: false, penalty: 0 };
}

export async function checkRealityDomain(domain: string): Promise<DomainCheckResult> {
    const domainToCheck = domain.includes(':') ? domain : `${domain}:443`;
    const host = domainToCheck.split(':')[0];

    if (!isValidDomainFormat(host)) {
        return { isValid: false, message: 'Invalid Domain Format' };
    }

    const risk = checkDomainRisk(host);
    const isPremium = PREMIUM_DOMAINS.some(w => host.endsWith(w));

    try {
        const url = `https://${host}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const start = Date.now();
        const fetchPromise = fetch(url, { method: 'HEAD', signal: controller.signal }).catch(() => null);

        const backendPromise = inboundApi.checkReality(host).catch(() => null);

        const [response, backendResult] = await Promise.all([fetchPromise, backendPromise]);
        clearTimeout(timeoutId);

        const clientLatency = Date.now() - start;
        const serverLatency = backendResult?.success ? backendResult.obj?.latency : null;
        const hasTls13 = backendResult?.success && backendResult.obj?.has_tls13;

        let score = 0;
        const info: string[] = [];

        if (hasTls13) {
            score += 40;
            const kex = backendResult?.obj?.key_exchange || 'X25519';
            info.push(`✓ TLS 1.3 | ${kex}`);
        } else {
            const detailedError = backendResult?.obj?.message || 'TLS 1.3 detection failed';
            info.push(`✗ ${detailedError}`);
        }

        const targetLatency = serverLatency || clientLatency;
        const latencyType = serverLatency ? 'Server' : 'Local';
        if (targetLatency < 300) {
            score += 30;
            info.push(`✓ ${latencyType} Fast (${targetLatency}ms)`);
        } else if (targetLatency < 1000) {
            score += 20;
            info.push(`✓ Normal (${targetLatency}ms)`);
        } else {
            info.push(`⚠ High Latency (${targetLatency}ms)`);
        }

        if (response?.type || isPremium || hasTls13) {
            score += 20;
            info.push('✓ H2/H3 Compatible');
        }

        if (isPremium) {
            score += 10;
            info.push('✓ Premium Node');
        }

        score = Math.max(0, score - risk.penalty);

        const isValid = !!hasTls13 && !risk.isRisk && score >= 50;

        let message = '';
        if (!hasTls13 && backendResult?.success) message = '✗ Reality requires TLS 1.3 support';
        else if (score >= 90) message = '🌟 Perfect Reality camouflage target';
        else if (score >= 70) message = '✅ Good for production use';
        else if (risk.isRisk) message = '⚠️ Risk detected: statistical tracking risk';
        else message = '⚠ Passed, but higher score domain recommended';

        return { isValid, score, message, details: info.join(' | '), warning: risk.reason };

    } catch (e) {
        return {
            isValid: false,
            message: '✗ Communication Error',
            details: 'Could not connect to backend or target is blocked',
            warning: risk.reason
        };
    }
}

export function quickCheckRealityDomainSync(domain: string): DomainCheckResult {
    const host = domain.split(':')[0];
    if (!isValidDomainFormat(host)) return { isValid: false, message: '✗ Format Error' };
    const risk = checkDomainRisk(host);
    return {
        isValid: !risk.isRisk,
        message: risk.isRisk ? '⚠️ Risk' : '✓ OK',
        warning: risk.reason
    };
}
