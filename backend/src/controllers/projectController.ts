import { Request, Response } from 'express';
import { createProject } from '../services/projectService'; // Ajuste o caminho conforme necessário

export const createProjectHandler = async (req: Request, res: Response) => {
    const { userId, projectName } = req.body;

    try {
        const project = await createProject(userId, projectName);
        res.status(201).json({
            message: 'Project created successfully',
            project,
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Adicione funções para update, delete e get de projetos de forma semelhante
