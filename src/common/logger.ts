export interface Logger {
    debug: (message: string, ...args: unknown[]) => void;
    info: (message: string, ...args: unknown[]) => void;
    warn: (message: string, ...args: unknown[]) => void;
    error: (message: string, ...args: unknown[]) => void;
}

export const createLogger = (
    namespace: string
): Logger => {
    return {
        debug: (message, ...args) => console.debug(`[${namespace}] ${message}`, ...args),
        info: (message, ...args) => console.info(`[${namespace}] ${message}`, ...args),
        warn: (message, ...args) => console.warn(`[${namespace}] ${message}`, ...args),
        error: (message, ...args) => console.error(`[${namespace}] ${message}`, ...args),
    };
};