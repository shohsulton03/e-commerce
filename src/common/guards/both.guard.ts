import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UserRole } from '../../user/entities/user.entity';

@Injectable()
export class BothGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    if (req.user.role === UserRole.ADMIN) {
      return true;
    }
    if (req.user.id != req.params.id) {
      throw new ForbiddenException('Ruxsat etilmagan user');
    }
    return true;
  }
}
