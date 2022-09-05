export interface IErrorModel {
    code: number,
    message: string;
}

const errors = {
    Unknown: {
        code: -1,
        message: "Something went wrong",
    },
    RowNotFound: {
        code: -100,
        message: "Row Not Found",
    },
    MaxRowLevel: {
        code: -101,
        message: ""
    },
    LeadToOrphanRow: {
        code: -102,
        message: ""
    },
    InvalidRowData: {
        code: -103,
        message: "Invalid row data"
    },
    DuplicateColumnName: {
        code: -200,
        message: "",
    },
    InvalidColumnName: {
        code: -201,
        message: "",
    },
    InvalidDataType: {
        code: -300,
        message: "",
    },
    ColumnNotFound: {
        code: -301,
        message: "",
    }
} as const;

export default errors;