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
import Artists from '../entities/artist.entity';
import { isUUID } from 'class-validator';
import { AppService } from '../app.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import Albums from '../entities/album.entity';

@Controller('artist')
export class ArtistController {
  constructor(
    @InjectDataSource('database')
    private dataSource: DataSource,
  ) {}

  @Get()
  async getArtists(): Promise<Artists[]> {
    return await this.dataSource.manager.find(Artists);
  }

  @Get(':id')
  async getArtistById(@Param('id') id: string): Promise<Artists> {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid artist id');
    const artist = await this.dataSource.manager.findOneBy(Artists, { id: id });
    if (!artist)
      throw new NotFoundException(`Artist with id - ${id} not found!`);
    return artist;
  }

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

  // @Put(':id')
  // async editArtist(
  //   @Param('id') id: string,
  //   @Body() artistInfo: Partial<Artists>,
  // ): Artists {
  //   if (!isUUID(id, 4)) throw new BadRequestException('Invalid artist id');
  //   if (!artistInfo.name || typeof artistInfo.grammy !== 'boolean')
  //     throw new BadRequestException('Body does not contain required fields');
  //   const artist: Artists = this.appService.artistService.get(id);
  //   if (!artist)
  //     throw new NotFoundException(`Artist with id - ${id} not found!`);
  //   artist.name = artistInfo.name;
  //   artist.grammy = artistInfo.grammy;
  //   this.appService.artistService.update(artist);
  //   return this.appService.artistService.get(id);
  // }
  //
  // @HttpCode(204)
  // @Delete(':id')
  // deleteArtist(@Param('id') id: string) {
  //   // if (!isUUID(id, 4)) throw new BadRequestException('Invalid artist id');
  //   // if (!this.appService.artistService.get(id))
  //   //   throw new NotFoundException(`Artist with id - ${id} not found!`);
  //   // const tracksWithArtist = this.appService.trackService.query(
  //   //   (data) => data.artistId === id,
  //   // );
  //   // const albumWithArtist = this.appService.albumService.query(
  //   //   (data) => data.artistId === id,
  //   // );
  //   // tracksWithArtist.forEach((value) => (value.artistId = null));
  //   // this.appService.trackService.updateMany(tracksWithArtist);
  //   // albumWithArtist.forEach((value) => (value.artistId = null));
  //   // this.appService.albumService.updateMany(albumWithArtist);
  //   // this.appService.favorites.artists =
  //   //   this.appService.favorites.artists.filter((artistId) => {
  //   //     return artistId !== id;
  //   //   });
  //   // return this.appService.artistService.delete(id);
  // }
}
