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
import { isUUID } from 'class-validator';
import Albums from '../entities/album.entity';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Controller('album')
export class AlbumController {
  constructor(
    @InjectDataSource('database')
    private dataSource: DataSource,
  ) {}

  @Get()
  async getAlbums(): Promise<Albums[]> {
    return await this.dataSource.manager.find(Albums);
  }

  @Get(':id')
  async etAlbumById(@Param('id') id: string): Promise<Albums> {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid album id');
    const album = await this.dataSource.manager.findOneBy(Albums, { id: id });
    if (!album) throw new NotFoundException(`Album with id - ${id} not found!`);
    return album;
  }

  // @Post()
  // addAlbum(@Body() album: Partial<Albums>): Albums {
  //   if (!album.name || !album.year)
  //     throw new BadRequestException('Body does not contain required fields');
  //   const newAlbum: Pick<Albums, 'name' | 'year' | 'artistId'> = {
  //     name: album.name,
  //     year: album.year,
  //     artistId: album.artistId || null,
  //   };
  //   return this.appService.albumService.create(newAlbum);
  // }
  //
  // @Put(':id')
  // editAlbum(
  //   @Param('id') id: string,
  //   @Body() albumInfo: Partial<Albums>,
  // ): Albums {
  //   if (!isUUID(id, 4)) throw new BadRequestException('Invalid album id');
  //   if (
  //     !albumInfo.name ||
  //     !albumInfo.year ||
  //     !(albumInfo.artistId === null || typeof albumInfo.artistId === 'string')
  //   )
  //     throw new BadRequestException('Body does not contain required fields');
  //   const album: Albums = this.appService.albumService.get(id);
  //   if (!album) throw new NotFoundException(`Album with id - ${id} not found!`);
  //   album.year = albumInfo.year || album.year;
  //   album.name = albumInfo.name || album.name;
  //   album.artistId = albumInfo.artistId || album.artistId;
  //   this.appService.albumService.update(album);
  //   return this.appService.albumService.get(id);
  // }
  //
  // @HttpCode(204)
  // @Delete(':id')
  // deleteAlbum(@Param('id') id: string) {
  //   // if (!isUUID(id, 4)) throw new BadRequestException('Invalid album id');
  //   // if (!this.appService.albumService.get(id))
  //   //   throw new NotFoundException(`Album with id - ${id} not found!`);
  //   // const tracksWithAlbum = this.appService.trackService.query(
  //   //   (data) => data.albumId === id,
  //   // );
  //   // const forUpdate = tracksWithAlbum.map((value) => {
  //   //   value.albumId = null;
  //   //   return value;
  //   // });
  //   // this.appService.trackService.updateMany(forUpdate);
  //   // this.appService.favorites.albums = this.appService.favorites.albums.filter(
  //   //   (albumId) => {
  //   //     return albumId !== id;
  //   //   },
  //   // );
  //   // return this.appService.albumService.delete(id);
  // }
}
