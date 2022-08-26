import MockRepository from "@db/mockRepository";
import IRecord from "@interfaces/record.interface";
const repo = MockRepository.getInstance();

const getRecords = (page: number, pageSize: number): Promise<IRecord[]> => {
    return repo.getRows(page, pageSize);
}

const changeRecord = (recordId: number, newRecord: IRecord): Promise<void> => {
    return repo.editRow(recordId, newRecord);
}

const createNextRecord = (recordId: number, newRecord: IRecord): Promise<number> => {
    return repo.addNextRow(recordId, newRecord);
}

const createChildRecord = (recordId: number, newRecord: IRecord): Promise<number> => {
    return repo.addChildRow(recordId, newRecord);
}

const moveAsChild = async (recordId: number, oldRecordId: number): Promise<void> => {
    return repo.moveAsChild(recordId, oldRecordId);
}

const moveAsNext = async (recordId: number, oldRecordId: number): Promise<void> => {
    return repo.moveAsNext(recordId, oldRecordId);
}

const deleteRecord = async (recordId: number) => {
    return repo.deleteRow({ rowId: recordId });
}
export default {
    getRecords,
    changeRecord,
    createNextRecord,
    createChildRecord,
    moveAsChild,
    moveAsNext,
    deleteRecord,
} as const;