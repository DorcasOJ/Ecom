import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserInfo {
  // @ApiProperty()
  // @IsString()
  // login_time: string;

  // @ApiProperty()
  // @IsObject()
  // country: { longitude: string; latitude: string };

  @ApiProperty()
  @IsString()
  ip_address: string;
}

//   @ApiProperty()
//   @IsString()
//   browser_name: string;

//   @ApiProperty()
//   @IsString()
//   os_name: string;
// }
