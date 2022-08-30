import IColumnInfo from "@interfaces/column.interface";
import { IDataType } from "@interfaces/data-type.interface";
import DataTypeFactory from "@services/data-type.service";

export default class Column {
    columnName: string;
    dataType: IDataType;
    mandatory: boolean;

    constructor(columnInfo: IColumnInfo) {
        this.dataType = DataTypeFactory.createDataType(columnInfo);
        this.columnName = columnInfo.columnName;
        this.mandatory = columnInfo.mandatory;
    }

    toRawData(): IColumnInfo {
        return {
            columnName: this.columnName,
            mandatory: this.mandatory,
            ...this.dataType.toRawData(),
        }
    }

    static isPrimaryName(name: string) {
        return name == "RowID";
    }

    static isExceptionName(name: string) {
        return ["children", "RowID"].includes(name);
    }
}