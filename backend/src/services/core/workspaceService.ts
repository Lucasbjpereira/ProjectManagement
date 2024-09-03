import { Client } from 'pg';

class WorkspaceService {
    private client: Client;

    constructor(workspace_id: string) {
        const dbName = `workspace_${workspace_id}`;
        const connectionString = process.env.DATABASE_URL + `/${dbName}`;
        this.client = new Client({ connectionString });
    }

    async connect() {
        await this.client.connect();
    }

    async disconnect() {
        await this.client.end();
    }

    async query(queryText: string, params?: any[]) {
        return this.client.query(queryText, params);
    }
}

export default WorkspaceService;
