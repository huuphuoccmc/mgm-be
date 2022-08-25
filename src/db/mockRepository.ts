import mockDb from "./mockDb";
import Repository from "./repository";

export default class MockRepository extends Repository {
    private static instance: MockRepository;
    
    private constructor() {
        super(mockDb);
    }

    public static getInstance() {
        if(!MockRepository.instance) {
            MockRepository.instance = new MockRepository();
        }
        return MockRepository.instance;
    }
}