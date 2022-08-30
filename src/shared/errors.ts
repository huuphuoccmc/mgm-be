export interface IErrorModel {
    code: number,
    message: string;
}

const errors = {
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
        message: ""
    }
} as const;

export default errors;