import { Profile } from '@app/common/database/entities/profile.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { EcomResponse, Users } from '@app/common';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
    @InjectRepository(Users) private userRepo: Repository<Users>,
  ) {}

  async createProfile(body: CreateProfileDto): Promise<Profile> {
    try {
      // check if profile already exist
      const profileExist = await this.profileRepo.findOne({
        where: { email: body.email },
      });
      if (profileExist) {
        throw new BadRequestException(
          EcomResponse.BadRequest(
            'Bad Request',
            `A profil with ${body.email} already exists`,
          ),
        );
      }

      // check if email is verified
      const profileUser = await this.userRepo.findOne({
        where: { email: body.email },
      });

      if (!profileUser.isEmailVerified) {
        throw new BadRequestException(
          EcomResponse.BadRequest('Bad Request', 'Email is not verified!'),
        );
      }

      const profile = await this.profileRepo.create({ ...body });
      const newProfile = await this.profileRepo.save(profile);

      if (profileUser.profileID !== newProfile.id) {
        await this.userRepo.update(profileUser.id, {
          ...profileUser,
          profileID: newProfile.id,
        });
      }
      return newProfile;
    } catch (error) {
      throw new BadRequestException(
        EcomResponse.BadRequest('Internal Server Error', error.message, '500'),
      );
    }
  }

  async getOne(profileId: string): Promise<Profile> {
    try {
      const profile = await this.profileRepo.findOne({
        where: { id: profileId },
      });
      return profile;
    } catch (error) {
      throw new BadRequestException(
        EcomResponse.BadRequest('Internal Server Error', error.message, '500'),
      );
    }
  }

  async updateProfile(
    profileId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    try {
      await this.profileRepo.update(profileId, updateProfileDto);
      const updatedProfile = await this.profileRepo.findOne({
        where: { id: profileId },
      });
      if (updatedProfile) {
        return updatedProfile;
      }
    } catch (error) {
      throw new BadRequestException(
        EcomResponse.BadRequest('Internal Server Error', error.message, '500'),
      );
    }
  }

  async deleteProfile(profileId: string): Promise<void> {
    try {
      await this.profileRepo.delete(profileId);
    } catch (error) {
      throw new BadRequestException(
        EcomResponse.BadRequest('Internal Server Error', error.message, '500'),
      );
    }
  }

  // async uploadImage(): // file: Express.Multer.File,
  // // profileId: string,
  // Promise<string> {
  //   return 'will work on it after';
  // }

  async getAll() {
    return await this.profileRepo.find();
  }

  async getUserProfiles(): Promise<any> {
    try {
      const output = await this.profileRepo
        .createQueryBuilder('profile')
        .groupBy('profile.id')
        .getMany();

      const count = await this.profileRepo
        .createQueryBuilder('profile')
        .getCount();

      return { count, output };
    } catch (error) {
      throw new BadRequestException(
        EcomResponse.BadRequest('Internal Server Error', error.message, '500'),
      );
    }
  }
}
