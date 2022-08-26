export default interface IRecord {
    data: Record<string, any>;
    children?: IRecord[];
}