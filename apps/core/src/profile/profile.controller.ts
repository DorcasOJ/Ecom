import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateProfileDto } from './dto/create-profile.dto';
import { EcomResponse, Ok } from '@app/common';
import { Profile } from '@app/common/database/entities/profile.entity';
import { IdCheck } from '@app/common/decorators/idcheck.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthorizationGuard } from '@app/common/guards/authorization.guard';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Add a new profile' })
  async createProfile(@Body() body: CreateProfileDto): Promise<Ok<Profile>> {
    const userProfile = await this.profileService.createProfile(body);
    return EcomResponse.Ok(userProfile, 'Profile created', 201);
  }

  @Get('/:profileId')
  //   @IdCheck('profileId')
  @ApiOperation({ summary: 'Get a profile' })
  async getOne(
    @Param('profileId', new ParseUUIDPipe())
    profileId: string,
  ): Promise<Ok<Profile>> {
    const profile = await this.profileService.getOne(profileId);
    return EcomResponse.Ok(profile, 'Ok', 200);
  }

  @Patch(':profileId')
  //   @IdCheck('profileId')
  // @UseGuards(AuthorizationGuard)
  @ApiOperation({ summary: 'Update an existing profile' })
  async updateProfile(
    @Param('profileId', ParseUUIDPipe) profileId: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @Query('profileId') user_profile_id: string,
  ): Promise<Ok<Profile>> {
    const profile = await this.profileService.updateProfile(
      profileId,
      updateProfileDto,
    );
    return EcomResponse.Ok(profile, 'OK', 200);
  }

  @Delete('/profileId')
  //   @IdCheck('profileId')
  // @UseGuards(AuthorizationGuard)
  @ApiOperation({ summary: 'delete an existing profile' })
  async deleteOne(
    @Param('profileId', ParseUUIDPipe) profileId: string,
    @Query('profileId') user_profile_id: string,
  ): Promise<Ok<string>> {
    await this.profileService.deleteProfile(profileId);
    return EcomResponse.Ok('Profile deleted Successfully', 'Ok', '200');
  }

  @Get('/')
  @ApiOperation({ summary: 'get all profile' })
  async hello() {
    return this.profileService.getAll();
  }

  @Get('/admin-data')
  @ApiOperation({ summary: 'get profile details fpr admin dashboard' })
  async dasboard(): Promise<Ok<any>> {
    const result = await this.profileService.getUserProfiles();
    return EcomResponse.Ok(result, 'Ok', 200);
  }
}
