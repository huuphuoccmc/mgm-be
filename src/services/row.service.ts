import IRecord from "@interfaces/record.interface";
import Column from "./column.service";

export default class Row {
    static MAX_LEVEL = 3;
    data: Record<string, any>;
    level: number;
    childHead?: Row;
    next?: Row;
    previous?: Row;
    parent?: Row;
    last?: Row;

    constructor(record: IRecord, level: number = 1, next?: Row, parent?: Row, previous?: Row) {
        if (level > Row.MAX_LEVEL) throw "Reach limit parent-child level";
        if (record.children && record.children[0]) {
            this.childHead = new Row(record.children[0], level + 1, undefined, this);
            let current = this.childHead;
            for (let i = 1; i < record.children.length; i++) {
                const temp = new Row(record.children[i], level + 1, undefined, this, current);
                current.next = temp;
                current = temp;
            }
            this.childHead.last = current;
        }
        this.data = record.data;
        this.level = level;
        this.parent = parent;
        this.next = next;
        this.previous = previous;
    }

    toRawData(): IRecord[] {
        return [
            {
                data: this.data,
                children: this.childHead?.toRawData(),
            },
            ...(this.next?.toRawData() || []),
        ];
    }

    toRecord(): IRecord {
        return {
            data: this.data,
        }
    }
    addNext(record: IRecord) {
        const temp = this.next;
        this.next = new Row(record, this.level);
        this.next.next = temp;
    }

    addChild(record: IRecord) {
        if (this.level === Row.MAX_LEVEL) throw "Reach limit parent-child level";
        if (!this.childHead) {
            this.childHead = new Row(record, this.level + 1, undefined, this);
            this.childHead.last = this.childHead;
        }

        this.childHead.last?.addNext(record);
    }

    isValidParent() {
        return this.level === Row.MAX_LEVEL;
    }

    isParent() {
        return this.childHead != undefined;
    }

    find(rowId: number): Row | undefined {
        let current: Row | undefined = this;
        while (current) {
            if (current.data.RowID == rowId)
                return current;
            current = current.next;
        }

        if (!this.childHead) {
            return;
        }
        return this.childHead.find(rowId);
    }

    onChangeColumn(oldColumn: Column, newColumn: Column) {
        let current: Row | undefined = this;
        const isChangeColumnName = newColumn.columnName !== oldColumn.columnName;
        const isChangeDataType = newColumn.dataType.getSymbol() !== oldColumn.dataType.getSymbol();
        while (current) {
            current.data[newColumn.columnName] = isChangeDataType ? newColumn.dataType.cast(current.data[oldColumn.columnName]) : current.data[oldColumn.columnName];
            if (isChangeColumnName) {
                delete current.data[oldColumn.columnName];
            }
            current = current.next;
        }

        this.childHead?.onChangeColumn(oldColumn, newColumn);
    }

    onAddColumn(newColumn: Column) {
        let current: Row | undefined = this;
        while (current) {
            current.data[newColumn.columnName] = newColumn.dataType.defaultValue;
            current = current.next;
        }

        this.childHead?.onAddColumn(newColumn);
    }

    updateData(newData: Record<string, any>) {
        this.data = newData;
    }
}
