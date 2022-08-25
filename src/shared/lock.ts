import ILock from "@interfaces/lock.interface";
import IUserSession from "@interfaces/user-session.interface";
import AsyncLock from "async-lock";

export default class Lock implements ILock {
    info?: IUserSession;
    timeout?: NodeJS.Timeout | undefined;
    mutex: AsyncLock;
    constructor(timeout?: number) {
        this.mutex = new AsyncLock({ maxOccupationTime: timeout });
    }
    isAcquired(): boolean {
        throw new Error("Method not implemented.");
    }
    lock(info: IUserSession, options?: any): void {
        throw new Error("Method not implemented.");
    }
    release(): void {
        throw new Error("Method not implemented.");
    }
    compare(userId: number, tabId: number): boolean {
        throw new Error("Method not implemented.");
    }

}