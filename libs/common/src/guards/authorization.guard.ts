import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { EcomResponse } from '../helpers/response';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const requestProfileId = request.query['profileId'];
      const profileId = request.profileId;

      if (requestProfileId !== profileId) {
        throw new ForbiddenException(
          EcomResponse.BadRequest(
            'Authorization Error',
            'Authorization required to perform this action',
            '401',
          ),
        );
      }
      return true;
    } catch (error) {
      throw new BadRequestException(
        EcomResponse.BadRequest('Internal Server Error', error.message, '500'),
      );
    }
  }
}
