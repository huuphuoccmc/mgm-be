import HttpStatusCodes from 'http-status-codes';


export abstract class CustomError extends Error {

    public readonly HttpStatus = HttpStatusCodes.BAD_REQUEST;

    constructor(msg: string, httpStatus: number) {
        super(msg);
        this.HttpStatus = httpStatus;
    }
}


export class ParamMissingError extends CustomError {

    public static readonly Msg = 'One or more of the required parameters was missing.';
    public static readonly HttpStatus = HttpStatusCodes.BAD_REQUEST;

    constructor() {
        super(ParamMissingError.Msg, ParamMissingError.HttpStatus);
    }
}


export class UserNotFoundError extends CustomError {

    public static readonly Msg = 'A user with the given id does not exists in the database.';
    public static readonly HttpStatus = HttpStatusCodes.NOT_FOUND;

    constructor() {
        super(UserNotFoundError.Msg, UserNotFoundError.HttpStatus);
    }
}

export enum LockType {
    Row = "RowLock",
    Col = "ColLock"
}
export class LockingResourceError extends CustomError {
    public static readonly HttpStatus = HttpStatusCodes.BAD_REQUEST;

    constructor(lockInfo: any, lockType: LockType) {
        super(`Failed. User${lockInfo.userId}.Tab${lockInfo.tabId} occupies ${lockType}`, LockingResourceError.HttpStatus);
    }
}