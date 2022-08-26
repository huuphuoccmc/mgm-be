
export interface IDataType {
    defaultValue: string;
    cast(value: any): any;
    validate(value: any): void;
    toRawData(): any;
    getSymbol(): string;
}