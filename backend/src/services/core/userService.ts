import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { createDatabase, createWorkspaceTables } from '../../utils/databaseUtils';

const prisma = new PrismaClient();

export const loginUser = async (email: string, password: string) => {
    const user = await prisma.users.findUnique({ 
        where: { email }
    });

    if (!user) {
        throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    return { id: user.id, username: user.username, email: user.email, workspaceId: user.workspace_id };
};

export const registerUser = async (username: string, email: string, password: string, workspaceName: string) => {
    const existingUser = await prisma.users.findUnique({ where: { email } });

    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const workspace = await prisma.workspaces.create({ data: { name: workspaceName } });

    const newDatabaseName = `workspace_${workspace.id}`;
    await createDatabase(newDatabaseName);
    await createWorkspaceTables(newDatabaseName);

    const user = await prisma.users.create({
        data: {
            username,
            email,
            password: hashedPassword,
            workspace_id: workspace.id,
        },
    });

    // Inserir na tabela WorkspaceUser
    await prisma.workspace_users.create({
        data: {
            user_id: user.id,
            workspace_id: workspace.id,
            role_id: 1 // Admin
        },
    });

    return user;
};
