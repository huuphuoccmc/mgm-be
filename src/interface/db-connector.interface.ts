export default interface IDbConnector {
    save(data: Record<string, any>): void;
    load(): Record<string, any>;
}