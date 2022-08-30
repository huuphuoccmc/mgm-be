export default interface IDbConnector {
    save(data: Record<string, any>): Promise<void>;
    load(): Promise<Record<string, any>>;
}