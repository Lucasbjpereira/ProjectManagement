import { Request, Response } from 'express';
import { registerUser, loginUser } from '../../services/core/userService';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await loginUser(email, password);

    // Gera o token JWT incluindo o id e workspaceId do usuário
    const token = jwt.sign(
      { id: user.id, workspaceId: user.workspaceId }, // Inclui o workspaceId no token
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' } // Token expira em 1 hora
    );

    res.status(200).json({
      message: 'Login successful',
      user,
      token,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const register = async (req: Request, res: Response) => {

  const { username, email, password } = req.body;

  try {
    const user = await registerUser(username, email, password, `${username}'s Workspace`);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
