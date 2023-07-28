import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import ArtistEntity from '../entities/artist.entity';
import { isUUID } from 'class-validator';
import { AppService } from '../app.service';

@Controller('artist')
export class ArtistController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getArtists(): ArtistEntity[] {
    return this.appService.artistService.getAll();
  }

  @Get(':id')
  getArtistById(@Param('id') id: string): ArtistEntity[] {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid artist id');
    if (!this.appService.artistService.get(id))
      throw new NotFoundException(`Artist with id - ${id} not found!`);
    return this.appService.artistService.query((data) => data.id === id);
  }

  @Post()
  addArtist(@Body() artist: Partial<ArtistEntity>): ArtistEntity {
    if (typeof artist.grammy !== 'boolean' || !artist.name)
      throw new BadRequestException('Body does not contain required fields');
    const newArtist: Pick<ArtistEntity, 'name' | 'grammy'> = {
      name: artist.name,
      grammy: artist.grammy,
    };
    return this.appService.artistService.create(newArtist);
  }

  @Put(':id')
  editArtist(
    @Param('id') id: string,
    @Body() artistInfo: Partial<ArtistEntity>,
  ): void {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid artist id');
    const artist: ArtistEntity = this.appService.artistService.get(id);
    if (!artist)
      throw new NotFoundException(`Artist with id - ${id} not found!`);
    artist.name = artistInfo.name || artist.name;
    artist.grammy = artist.grammy || artist.grammy;
    return this.appService.artistService.update(artist);
  }

  @HttpCode(204)
  @Delete(':id')
  deleteArtist(@Param('id') id: string) {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid artist id');
    if (!this.appService.artistService.get(id))
      throw new NotFoundException(`Artist with id - ${id} not found!`);
    return this.appService.artistService.delete(id);
  }
}
