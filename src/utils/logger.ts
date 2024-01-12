export enum LOG_TYPE {
    INFO = "INFO",
    ERROR = "ERROR",
    WARNING = "WARNING"
}

export const logger = (message: string, type: LOG_TYPE) => {
    switch (type) {
        case LOG_TYPE.INFO:
            console.info(`[INFO][${new Date().toUTCString()}] ${message}`);
            break;
        case LOG_TYPE.ERROR:
            console.error(`[ERROR][${new Date().toUTCString()}] ${message}`);
            break;
        case LOG_TYPE.WARNING:
            console.warn(`[WARNING][${new Date().toUTCString()}] ${message}`);
            break;
    }
}