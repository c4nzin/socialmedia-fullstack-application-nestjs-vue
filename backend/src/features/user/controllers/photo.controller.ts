import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotoPipe } from '../pipes/photo.pipe';
import { Message, User } from 'src/common/decorators';
import { UserDocument } from '../schemas';
import { CommandBus } from '@nestjs/cqrs';
import { UploadPhotoCommand } from '../cqrs/photo/command/upload-photo.command';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { ApiTags } from '@nestjs/swagger';
import { UploadThumbnailPhotoCommand } from '../cqrs/photo/command/upload-thumbnail.command';

@Controller()
@ApiTags('photo')
@UseGuards(AuthenticatedGuard)
export class PhotoController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('me/profile-photo')
  @Message('Sucessfully uploaded profile picture.')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  public async uploadProfilePhoto(
    @UploadedFile(PhotoPipe) file: Express.Multer.File,
    @User('id') id: string,
  ): Promise<UserDocument> {
    return this.commandBus.execute(new UploadPhotoCommand(file, id));
  }

  @Put('me/profile-photo')
  @Message('Sucessfully updated profile picture.')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  public async updateProfilephoto(
    @UploadedFile(PhotoPipe) file: Express.Multer.File,
    @User('id') id: string,
  ): Promise<UserDocument> {
    return this.commandBus.execute(new UploadPhotoCommand(file, id));
  }

  @Put('me/thumbnail-photo')
  @Message('Sucessfully updated the thumbnail picture.')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  public async updateThumbnailPhoto(
    @UploadedFile(PhotoPipe) file: Express.Multer.File,
    @User('id') id: string,
  ): Promise<any> {
    return this.commandBus.execute(new UploadThumbnailPhotoCommand(file, id));
  }
}
