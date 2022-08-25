import IColumnInfo from "@interfaces/column.interface";
import IDbConnector from "@interfaces/db-connector.interface";
import Column from "@services/column.service";

export default class Repository {
  private dbConnector: IDbConnector;

  maxRowId: number = 0;
  columns: Column[] = [];
  constructor(dbConnector: IDbConnector) {
    this.dbConnector = dbConnector;
    this.loadData();
  }

  private async loadData() {
    const data = await this.dbConnector.load();
    this.columns = data.columns.map((col: any) => new Column(col));
    this.maxRowId = data.maxRowId;
  }

  private async saveData() {
    await this.dbConnector.save({
      columns: this.getColumns(),
      maxRowId: this.maxRowId,
    });
  }

  async getColumns() {
    return this.columns.map((col) => col.toRawData());
  }

  async changeColumn(columnName: string, columnInfo: IColumnInfo) {
    const index = this.columns.findIndex((col) => col.columnName === columnName);
    if (index === -1) {
      throw new Error("Column not found");
    }
    if (
      columnName !== columnInfo.columnName &&
      this.columns.find((col) => col.columnName === columnInfo.columnName)
    )
      throw new Error("Duplicate column name");

    this.columns[index] = new Column(columnInfo);

    this.saveData();
  }
  async createColumn(columnInfo: IColumnInfo): Promise<void> {
    if (this.columns.find((col) => col.columnName === columnInfo.columnName))
      throw new Error("Duplicate column name");

    this.columns.push(new Column(columnInfo));
    this.saveData();
  }
}
