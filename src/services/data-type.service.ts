import IColumnInfo from "@interfaces/column.interface";
import { IDataType } from "@interfaces/data-type.interface";

class TextDataType implements IDataType {
    public static SYMBOL = "Text";
    defaultValue: string;

    constructor(columnInfo: IColumnInfo) {
        this.defaultValue = columnInfo.defaultValue;
    }
    cast(value: any) {
        throw new Error("Method not implemented.");
    }
    toRawData(): any {
        throw new Error("Method not implemented.");
    }
}

class NumDataType implements IDataType {
    public static SYMBOL = "Num";
    defaultValue: string;

    constructor(columnInfo: IColumnInfo) {
        this.defaultValue = columnInfo.defaultValue;
    }
    cast(value: any) {
        throw new Error("Method not implemented.");
    }
    toRawData(): any {
        return {
            dataType: NumDataType.SYMBOL,
            defaultValue: this.defaultValue,
        }
    }
}

class BoolDataType implements IDataType {
    public static SYMBOL = "Boolean";
    defaultValue: string;

    constructor(columnInfo: IColumnInfo) {
        this.defaultValue = columnInfo.defaultValue;
    }
    cast(value: any) {
        throw new Error("Method not implemented.");
    }
    toRawData(): any {
        throw new Error("Method not implemented.");
    }
}

class DateDataType implements IDataType {
    public static SYMBOL = "Date";
    defaultValue: string;

    constructor(columnInfo: IColumnInfo) {
        this.defaultValue = columnInfo.defaultValue;
    }
    cast(value: any) {
        throw new Error("Method not implemented.");
    }
    toRawData(): any {
        throw new Error("Method not implemented.");
    }
}


class EnumDataType implements IDataType {
    public static SYMBOL = "DropDownList";
    defaultValue: string;

    constructor(columnInfo: IColumnInfo) {
        this.defaultValue = columnInfo.defaultValue;
    }
    cast(value: any) {
        throw new Error("Method not implemented.");
    }
    toRawData(): any {
        throw new Error("Method not implemented.");
    }
}
const ClassMap = new Map<string, any>(
    [
        [TextDataType.SYMBOL, TextDataType],
        [NumDataType.SYMBOL, NumDataType],
        [BoolDataType.SYMBOL, BoolDataType],
        [DateDataType.SYMBOL, DateDataType],
        [EnumDataType.SYMBOL, EnumDataType],
    ]
)

export default class DataTypeFactory {
    public static createDataType(columnInfo: IColumnInfo) {
        const T = ClassMap.get(columnInfo.dataType);
        if(!T)
            throw new Error("invalid datatype");
        return new T(columnInfo);
    }
}
