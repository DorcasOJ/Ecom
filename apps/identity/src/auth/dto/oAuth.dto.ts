import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { UserInfo } from '../../users/dto/user-info.dto';

export class OAuthDto {
  @IsString()
  @ApiProperty()
  token: string;

  // @IsOptional()
  // @ApiProperty()
  // userInfo: UserInfo;
}
