export default interface IColumnInfo {
    columnName: string;
    dataType: string;
    defaultValue: any;
    mandatory: boolean;
    ddlValues?: string[];
}
