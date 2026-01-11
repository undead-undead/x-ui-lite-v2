const formatBytes = (bytes: number) => {
    if (!bytes || isNaN(bytes) || bytes <= 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    if (i < 0) return '0 B';
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + (sizes[i] || 'B');
};

export const formatTraffic = (bytes: number) => {
    return formatBytes(bytes);
};

export const formatSpeed = (bytesPerSecond: number) => {
    return formatBytes(bytesPerSecond) + '/s';
};