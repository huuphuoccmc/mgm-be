import IColumnInfo from "@interfaces/column.interface";
import IDbConnector from "@interfaces/db-connector.interface";
import IRecord from "@interfaces/record.interface";
import Column from "@services/column.service";
import Row from "@services/row.service";
import errors from "@shared/errors";
import Graceful from "node-graceful";

let columns: IColumnInfo[] = [];
const rowMap = new Map<number, IRecord>();
let maxRowId = 0;
let startRowId = 0;

const loadData = async (dbConnector: IDbConnector) => {
  const data = await dbConnector.load();
  columns = data.columns;
  maxRowId = data.maxRowId;
  startRowId = data.startRowId;
  loadRowData(data.rows, rowMap);
}

const loadRowData = (data: any, rowMap: Map<number, IRecord>, parentId?: number) => {
  data.forEach((e: any, index: number) => {
    const rowData = { ...e };
    rowData.children = e.children ? e.children.map((child: any) => child.RowID) : [];
    if (data[index - 1])
      rowData.previousId = data[index - 1].RowID;
    if (data[index + 1])
      rowData.nextId = data[index + 1].RowID;
    if (parentId)
      rowData.parentId = parentId;
    rowMap.set(e.RowID, rowData);
    loadRowData(e.children, rowMap, e.RowID);
  });
}

const getRowData = (rowMap: Map<number, IRecord>, rowId: number): IRecord => {
  const rowData = rowMap.get(rowId);
  if (!rowData) {
    throw errors.RowNotFound;
  }

  rowData.children = rowData.children.map((childId: number ) => getRowData(childId));
  return rowData;
}

const getRowsData = (rowMap: Map<number, IRecord>, startRowId: number, limit: number) => {

}

const saveData = async (dbConnector: IDbConnector) => {
  await dbConnector.save({
    rows: getRowsData(),
    columns,
  })
}

export default class Repository {
  private dbConnector: IDbConnector;

  maxRowId: number = 0;
  columns: Column[] = [];
  rows: Row[] = [];
  constructor(dbConnector: IDbConnector) {
    this.dbConnector = dbConnector;
    this.loadData();
    Graceful.on("exit", () => this.saveData());
  }

  private async loadData() {
    const data = await this.dbConnector.load();
    this.columns = data.columns.map((col: any) => new Column(col));
    this.rows = data.rows.map((row: any) => new Row(row));
    this.maxRowId = data.maxRowId;
  }

  public async saveData() {
    await this.dbConnector.save({
      columns: await this.getColumns(),
      rows: await this.getAllRow(),
      maxRowId: this.maxRowId,
    });
  }
  async getAllRow(): Promise<any[]> {
    return this.rows.map((row) => row.toRawData()[0]);
  }

  async getColumns(): Promise<IColumnInfo[]> {
    return this.columns.map((col) => col.toRawData());
  }

  async changeColumn(columnName: string, columnInfo: IColumnInfo) {
    const index = this.columns.findIndex(
      (col) => col.columnName === columnName
    );
    if (index === -1) {
      throw new Error("Column not found");
    }
    if (
      columnName !== columnInfo.columnName &&
      this.columns.find((col) => col.columnName === columnInfo.columnName)
    )
      throw new Error("Duplicate column name");

    const oldColumn = this.columns[index];
    this.columns[index] = new Column(columnInfo);

    this.rows.forEach((row) =>
      row.onChangeColumn(oldColumn, this.columns[index])
    );
  }
  async createColumn(columnInfo: IColumnInfo): Promise<void> {
    if (this.columns.find((col) => col.columnName === columnInfo.columnName))
      throw new Error("Duplicate column name");

    const newColumn = new Column(columnInfo);
    this.columns.push(newColumn);
    this.rows.forEach(row => row.onAddColumn(newColumn))
  }

  async getRows(page: number, pageSize: number): Promise<IRecord[]> {
    return this.rows
      .slice((page - 1) * pageSize, page * pageSize)
      .map((row) => row.toRawData()[0]);
  }

  async addNextRow(rowId: number, record: IRecord): Promise<number> {
    record.data.RowID = this.maxRowId + 1;
    this.validateRecord(record);
    const { result, index } = this.find(rowId);
    if (index >= 0) {
      this.rows.splice(index, 0, new Row(record));
      this.maxRowId++;
      return this.maxRowId;
    }
    if (result) {
      result.addNext(record);
      this.maxRowId++;
      return this.maxRowId;
    }
    throw new Error("row target not found");
  }

  async addChildRow(rowId: number, record: IRecord): Promise<number> {
    record.data.RowID = this.maxRowId + 1;
    this.validateRecord(record);
    const { result } = this.find(rowId);
    if (result) {
      result.addChild(record);
      this.maxRowId++;
      return this.maxRowId;
    }
    throw new Error("row target not found");
  }

  async editRow(rowId: number, record: IRecord) {
    this.validateRecord(record);
    const { result } = this.find(rowId);
    if (result) {
      result.updateData(record);
    }
    throw new Error("row target not found");
  }

  async moveAsChild(recordId: number, oldRecordId: number) {
    const { result: targetRow, index: targetIndex } = this.find(oldRecordId);
    if (!targetRow)
      throw new Error("row target not found");
    if (targetRow.isParent())
      throw new Error("Your move shall lead to Orphan Rows");
    const { result: parentRow, index: parentIndex } = this.find(recordId);
    if (!parentRow)
      throw new Error("parent row not found");

    const record = await this.deleteRow({ row: targetRow });
    parentRow.addChild(record);
  }

  async moveAsNext(recordId: number, oldRecordId: number) {
    const { result: targetRow, index: targetIndex } = this.find(oldRecordId);
    if (!targetRow)
      throw new Error("row target not found");
    if (targetRow.isParent())
      throw new Error("Your move shall lead to Orphan Rows");
    const { result: previousRow, index: previousIndex } = this.find(recordId);
    if (!previousRow)
      throw new Error("parent row not found");

    const record = await this.deleteRow({ row: targetRow });

    if (previousIndex) {
      this.rows.splice(previousIndex, 0, new Row(record));
    } else {
      previousRow.addNext(record)
    }
  }

  find(rowId: number) {
    let index = this.rows.findIndex(row => row.data.RowID == rowId);
    if (index !== -1) return { result: this.rows[index], index };
    for (let i = 0; i < this.rows.length; i++) {
      const row = this.rows[i];
      let result = row.find(rowId);
      if (result) {
        return { result, index };
      }
    }
    return {
      index: -1,
    }
  }

  async deleteRow({ rowId, row, index = -1 }: { rowId?: number, row?: Row, index?: number }) {
    if (rowId) {
      const target = this.find(rowId);
      row = target.result;
      index = target.index;
    }
    if (!row) {
      throw new Error("Row target not found");
    }
    if (row.isParent()) {
      throw new Error("Your delete shall lead to Orphan Rows")
    }
    if (index >= 0) {
      this.rows.splice(index, 1);
    } else {
      if (row.previous) {
        row.previous.next = row.next;
      } else {
        if (row.parent) row.parent.childHead = row.next;
        if (row.next) row.next.previous = undefined;
      }
    }

    const record = row.toRecord();
    delete row.childHead;
    delete row.next;
    delete row.previous;
    delete row.parent;
    return record;
  }
  validateRecord(record: IRecord) {
    this.columns.forEach(
      (col) =>
        (!col.mandatory && record.data[col.columnName] === undefined) ||
        col.dataType.validate(record.data[col.columnName])
    );
  }
}
