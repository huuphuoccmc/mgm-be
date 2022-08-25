export default interface IColumnInfo {
    columnName: string;
    dataType: string;
    defaultValue: string;
    mandatory: boolean;
    ddlValues?: string[];
}
