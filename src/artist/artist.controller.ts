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
  UseGuards,
} from '@nestjs/common';
import Artists from '../entities/artist.entity';
import { isUUID } from 'class-validator';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import Albums from '../entities/album.entity';
import Tracks from '../entities/track.entity';
import { AuthGuard } from '../auth/auth.guard';

@Controller('artist')
export class ArtistController {
  constructor(
    @InjectDataSource('database')
    private dataSource: DataSource,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async getArtists(): Promise<Artists[]> {
    return await this.dataSource.manager.find(Artists);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getArtistById(@Param('id') id: string): Promise<Artists> {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid artist id');
    const artist = await this.dataSource.manager.findOneBy<Artists>(Artists, { id: id });
    if (!artist)
      throw new NotFoundException(`Artist with id - ${id} not found!`);
    return artist;
  }

  @UseGuards(AuthGuard)
  @Post()
  async addArtist(@Body() artist: Partial<Artists>): Promise<Artists> {
    if (typeof artist.grammy !== 'boolean' || !artist.name)
      throw new BadRequestException('Body does not contain required fields');
    const newArtist: Artists = new Artists();
    newArtist.name = artist.name;
    newArtist.grammy = artist.grammy;
    const artistsEntity = this.dataSource.manager.create(Artists, newArtist);
    await this.dataSource.manager.save(artistsEntity);
    return artistsEntity;
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async editArtist(
    @Param('id') id: string,
    @Body() artistInfo: Partial<Artists>,
  ): Promise<Artists> {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid artist id');
    if (!artistInfo.name || typeof artistInfo.grammy !== 'boolean')
      throw new BadRequestException('Body does not contain required fields');
    const artist: Artists = await this.dataSource.manager.findOneBy<Artists>(Artists, {
      id: id,
    });
    if (!artist)
      throw new NotFoundException(`Artist with id - ${id} not found!`);
    artist.name = artistInfo.name;
    artist.grammy = artistInfo.grammy;
    await this.dataSource.manager.save(Artists, artist);
    return artist;
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteArtist(@Param('id') id: string) {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid artist id');
    const artistForDelete = await this.dataSource.manager.findOneBy(Artists, {
      id: id,
    });
    if (!artistForDelete)
      throw new NotFoundException(`Artist with id - ${id} not found!`);
    const tracksWithArtist = await this.dataSource.manager.findBy(Tracks, {
      artistId: id,
    });
    const albumWithArtist = await this.dataSource.manager.findBy(Albums, {
      artistId: id,
    });
    tracksWithArtist.forEach((value) => (value.artistId = null));
    albumWithArtist.forEach((value) => (value.artistId = null));
    await this.dataSource.manager.save(Tracks, tracksWithArtist);
    await this.dataSource.manager.save(Albums, albumWithArtist);
    return await this.dataSource.manager.delete(Artists, { id: id });
  }
}
