import express from 'express';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware para tratar JSON
app.use(express.json());

// Rota de autenticação
app.use('/auth', authRoutes);
// Rota de projetos
app.use('/project', projectRoutes);

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
