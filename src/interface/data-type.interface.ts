
export interface IDataType {
    defaultValue: string;
    cast(value: any): any;
    toRawData(): any;
}