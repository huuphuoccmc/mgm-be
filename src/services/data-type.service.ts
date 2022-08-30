import IColumnInfo from "@interfaces/column.interface";
import { IDataType } from "@interfaces/data-type.interface";
import moment from "moment";

class TextDataType implements IDataType {
    public static SYMBOL = "Text";
    defaultValue: any;

    constructor(columnInfo: IColumnInfo) {
        this.defaultValue = columnInfo.defaultValue;
    }
    validate(value: any): void {
    }
    cast(value: any) {
        return value ? value.toString() : this.defaultValue;
    }
    toRawData(): any {
        return {
            dataType: TextDataType.SYMBOL,
            defaultValue: this.defaultValue,
        }
    }
    getSymbol() {
        return TextDataType.SYMBOL;
    }
}

class NumDataType implements IDataType {
    public static SYMBOL = "Num";
    defaultValue: any;

    constructor(columnInfo: IColumnInfo) {
        this.defaultValue = columnInfo.defaultValue;
    }
    validate(value: any): void {
        if (!/^-?\d+\.?\d*$/.test(value))
            throw new Error("Invalid number value");
    }
    cast(value: any) {
        if (/^-?\d+\.?\d*$/.test(value)) return +value;
        return this.defaultValue;
    }
    toRawData(): any {
        return {
            dataType: NumDataType.SYMBOL,
            defaultValue: this.defaultValue,
        }
    }
    getSymbol() {
        return NumDataType.SYMBOL;
    }
}

class BoolDataType implements IDataType {
    public static SYMBOL = "Boolean";
    defaultValue: any;

    constructor(columnInfo: IColumnInfo) {
        this.defaultValue = columnInfo.defaultValue;
    }
    validate(value: any): void {
        if(typeof value != "boolean")
            throw new Error("Invalid boolean value");
    }
    cast(value: any) {
        return Boolean(value);
    }
    toRawData(): any {
        return {
            dataType: BoolDataType.SYMBOL,
            defaultValue: this.defaultValue,
        }
    }
    getSymbol() {
        return BoolDataType.SYMBOL;
    }
}

class DateDataType implements IDataType {
    public static SYMBOL = "Date";
    public static DATE_FORMAT = "YYYY/MM/DD";
    defaultValue: any;

    constructor(columnInfo: IColumnInfo) {
        if(columnInfo.defaultValue){
            this.validate(columnInfo.defaultValue);
            this.defaultValue = moment(columnInfo.defaultValue).format(DateDataType.DATE_FORMAT);
        }
    }
    validate(value: any): void {
        if(!moment(value).isValid())
            throw new Error("Invalid date value");
    }
    cast(value: any) {
        const date = moment(value);
        return date.isValid() ? date.format(DateDataType.DATE_FORMAT): this.defaultValue;
    }
    toRawData(): any {
        return {
            dataType: DateDataType.SYMBOL,
            defaultValue: this.defaultValue,
        }
    }
    getSymbol() {
        return DateDataType.SYMBOL;
    }
}


class EnumDataType implements IDataType {
    public static SYMBOL = "DropDownList";
    defaultValue: any;
    ddlValues: string[] = [];

    constructor(columnInfo: IColumnInfo) {
        this.defaultValue = columnInfo.defaultValue;
    }
    validate(value: any): void {
        if(!this.ddlValues.includes(value))
            throw new Error("Invalid dropdown data");
    }
    cast(value: any) {
        if(typeof value == "undefined") {
            return this.defaultValue;
        };
        if(this.ddlValues.includes(value))
            return value;
        const result = value.toString();
        this.ddlValues.push(result);
        return result;
    }
    toRawData(): any {
        return {
            dataType: EnumDataType.SYMBOL,
            defaultValue: this.defaultValue,
            ddlValues: this.ddlValues,
        }
    }
    getSymbol() {
        return EnumDataType.SYMBOL;
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
        if (!T)
            throw new Error("invalid datatype");
        return new T(columnInfo);
    }
}
