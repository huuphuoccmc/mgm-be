import MockRepository from "@db/mockRepository";
import IColumnInfo from "@interfaces/column.interface";
import Column from "@services/column.service";
const repo = MockRepository.getInstance();

const getColumns = (): Promise<IColumnInfo[]> => {
    return repo.getColumns();
}

const changeColumn = (columnName: string, columnInfo: IColumnInfo): Promise<void> => {
    if(Column.isPrimaryName(columnName))
        throw new Error("Primary column can be change");
    if(Column.isExceptionName(columnInfo.columnName))
        throw new Error("New column name is not allowed");
    return repo.changeColumn(columnName, columnInfo);
}

const createColumn = (columnInfo: IColumnInfo): Promise<void> => {
    if(Column.isExceptionName(columnInfo.columnName))
        throw new Error("New column name is not allowed");
    return repo.createColumn(columnInfo);
}

export default {
    getColumns,
    changeColumn,
    createColumn,
} as const;