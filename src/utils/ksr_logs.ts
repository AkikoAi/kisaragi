import prisma from "./db";


export function addLogsUser(logMessage: string) {
    return prisma.logs.create({
        data: {
            type: "USER",
            message: logMessage,
            timestamp: new Date(),
        },
    }).catch(err => {
        console.error('Error writing to database:', err);
    });
}

export function addLogs(logMessage: string) {
    return prisma.logs.create({
        data: {
            type: "LOG",
            message: logMessage,
            timestamp: new Date(),
        },
    }).catch(err => {
        console.error('Error writing to database:', err);
    });
}

export function addLogsFE(error: unknown) {
    return prisma.logs.create({
        data: {
            type: "ERROR",
            message: (error as Error).message,
            timestamp: new Date(),
        },
    }).catch(err => {
        console.error('Error writing to database:', err);
    });
}