import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Ou use um tipo mais específico, se possível
    }
  }
}
