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
  getArtistById(@Param('id') id: string): ArtistEntity {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid artist id');
    if (!this.appService.artistService.get(id))
      throw new NotFoundException(`Artist with id - ${id} not found!`);
    return this.appService.artistService.get(id);
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
  ): ArtistEntity {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid artist id');
    if (!artistInfo.name || typeof artistInfo.grammy !== 'boolean')
      throw new BadRequestException('Body does not contain required fields');
    const artist: ArtistEntity = this.appService.artistService.get(id);
    if (!artist)
      throw new NotFoundException(`Artist with id - ${id} not found!`);
    artist.name = artistInfo.name;
    artist.grammy = artistInfo.grammy;
    this.appService.artistService.update(artist);
    return this.appService.artistService.get(id);
  }

  @HttpCode(204)
  @Delete(':id')
  deleteArtist(@Param('id') id: string) {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid artist id');
    if (!this.appService.artistService.get(id))
      throw new NotFoundException(`Artist with id - ${id} not found!`);
    const tracksWithArtist = this.appService.trackService.query(
      (data) => data.artistId === id,
    );
    const albumWithArtist = this.appService.albumService.query(
      (data) => data.artistId === id,
    );
    tracksWithArtist.forEach((value) => (value.artistId = null));
    this.appService.trackService.updateMany(tracksWithArtist);
    albumWithArtist.forEach((value) => (value.artistId = null));
    this.appService.albumService.updateMany(albumWithArtist);
    this.appService.favorites.artists =
      this.appService.favorites.artists.filter((artistId) => {
        return artistId !== id;
      });
    return this.appService.artistService.delete(id);
  }
}
