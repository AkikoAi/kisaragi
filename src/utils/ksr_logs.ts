import { appendFile } from "fs";
import path from "path";



export function addLogsUser(logMessage: string) {
    return appendFile("src/logs/user.txt", `[${new Date().toISOString()}] : ${logMessage}\n`, (err) => {
        if (err) console.error('Error writing to log file:', err);
    });
}

export function addLogs(logMessage: string) {
    return appendFile("src/logs/log.txt", `[${new Date().toISOString()}] : ${logMessage}\n`, (err) => {
        if (err) console.error('Error writing to log file:', err);
    });
}

export function addLogsFE(error: unknown) {
    return appendFile("src/logs/error.txt", `[${new Date().toISOString()}] : ${(error as Error).message}\n`, (err) => {
        if (err) console.error('Error writing to log file:', err);
    });
}