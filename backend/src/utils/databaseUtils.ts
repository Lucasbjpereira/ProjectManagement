import { Client } from 'pg';

export const createDatabase = async (dbName: string) => {
    const connectionString = process.env.DATABASE_URL + `/postgres`;
    const client = new Client({ connectionString });

    await client.connect();

    try {
        await client.query(`CREATE DATABASE "${dbName}"`);
        console.log(`Database ${dbName} created successfully`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error creating database: ${error.message}`);
        }
        throw error;
    } finally {
        await client.end();
    }
};

export const createWorkspaceTables = async (dbName: string) => {
    const connectionString = process.env.DATABASE_URL + `/${dbName}`;
    const client = new Client({ connectionString });

    try {
        await client.connect();

        // Definir as queries SQL para criar as tabelas necessárias
        const createTablesQuery = `
            CREATE TABLE IF NOT EXISTS task_type (
                id SERIAL PRIMARY KEY,
                name VARCHAR NOT NULL
            );

            CREATE TABLE IF NOT EXISTS task_status (
                id SERIAL PRIMARY KEY,
                name VARCHAR NOT NULL
            );

            CREATE TABLE IF NOT EXISTS project (
                id SERIAL PRIMARY KEY,
                icon VARCHAR,
                banner VARCHAR,
                logo VARCHAR,
                total_hours TIME,
                date_start TIMESTAMP,
                date_end TIMESTAMP,
                date_created TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS task (
                id SERIAL PRIMARY KEY,
                type INT REFERENCES task_type(id),
                status INT REFERENCES task_status(id),
                name VARCHAR NOT NULL,
                description TEXT
            );

            CREATE TABLE IF NOT EXISTS tag (
                id SERIAL PRIMARY KEY,
                name VARCHAR,
                color VARCHAR
            );

            CREATE TABLE IF NOT EXISTS tag_task (
                id SERIAL PRIMARY KEY,
                id_task INT REFERENCES task(id),
                id_tag INT REFERENCES tag(id)
            );

            CREATE TABLE IF NOT EXISTS task_user (
                id SERIAL PRIMARY KEY,
                id_user INT NOT NULL,
                id_task INT REFERENCES task(id)
            );

            CREATE TABLE IF NOT EXISTS project_users (
                id SERIAL PRIMARY KEY,
                id_user INT NOT NULL,
                id_project INT NOT NULL REFERENCES project(id)
            );
        `;

        await client.query(createTablesQuery);
        console.log(`Tables created successfully in database ${dbName}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error creating tables: ${error.message}`);
        }
        throw error;
    } finally {
        await client.end();
    }
};