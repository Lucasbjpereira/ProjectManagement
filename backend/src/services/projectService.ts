import { PrismaClient } from '@prisma/client';
import WorkspaceService from '../services/core/workspaceService';

const prisma = new PrismaClient();

export const createProject = async (userId: number, projectName: string) => {
    // Verifica se o usuário está associado a um workspace
    const user = await prisma.users.findUnique({
        where: { id: userId },
        include: { workspace: true },
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Cria o serviço do workspace e conecta
    const workspaceService = new WorkspaceService(user.workspace_id.toString());
    await workspaceService.connect();

    try {
        // Cria um novo projeto
        const project = await prisma.projects.create({  // Corrigido para "project"
            data: {
                name: projectName,
                workspace_id: user.workspace_id, // Assume que o projeto pertence ao workspace do usuário
            },
        });

        return project;
    } finally {
        // Garante que a conexão seja desconectada
        await workspaceService.disconnect();
    }
};
