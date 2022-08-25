export default interface IRecord {
    cells: Record<string, any>;
    children: IRecord[];
}