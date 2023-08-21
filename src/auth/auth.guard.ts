import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LibraryLogger } from '../logger/logger';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly logger: LibraryLogger,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    this.logger.verbose(
      `Request to - ${request.url} with query params - ${JSON.stringify(
        request.params,
      )} and with body - ${JSON.stringify(request.body)}.`,
    );
    if (!request.headers.authorization) {
      this.logger.error('Authorization header missing. Access is denied.');
      throw new UnauthorizedException();
    }
    const [type, token] = request.headers.authorization.split(' ');
    if (type !== 'Bearer') {
      this.logger.error('Wrong authorization scheme used. Access is denied.');
      throw new UnauthorizedException('Wrong scheme!');
    }
    try {
      this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch (err) {
      this.logger.error(
        'An access attempt was made with an invalid token. Access is denied.',
      );
      throw new UnauthorizedException('Token not valid!');
    }
    this.logger.verbose(
      `Assess to - ${request.url} - for - ${request.method} - ended with code - ${response.statusCode}. Access granted.`,
    );
    return true;
  }
}
