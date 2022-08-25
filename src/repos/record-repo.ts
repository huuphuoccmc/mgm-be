import IRecord from "@interfaces/record.interface";

const getRecords = (): IRecord[] => {
    return [];
}

const changeRecord = (recordId: number, newRecord: IRecord): void => {
    return;
}

const createRecord = (record: IRecord): void => {
    return;
}

export default {
    getRecords,
    changeRecord,
    createRecord,
} as const;