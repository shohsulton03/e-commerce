import { UserEntity } from 'path-to-your-user-entity';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number; // Yoki UserEntity ni to'liq ko'rsatish ham mumkin
        // name: string;
        // email: string;
      };
    }
  }
}
