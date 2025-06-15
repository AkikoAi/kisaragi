import { appendFile } from "fs";
import path from "path";

export function addLogs(logMessage: string) {
    return appendFile("src/logs/log.txt", `[${new Date().toISOString()}] : ${logMessage}\n`, (err) => {
        if (err) console.error('Error writing to log file:', err);
    });
}

export function addLogsFE(error:unknown){
    return addLogs((error as Error).message);
}