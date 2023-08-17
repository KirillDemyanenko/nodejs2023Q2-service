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
import { isUUID } from 'class-validator';
import Albums from '../entities/album.entity';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import Tracks from '../entities/track.entity';
import { FavoritesAlbums } from '../entities/fovorites.entity';
import { AuthGuard } from '../auth/auth.guard';

@Controller('album')
export class AlbumController {
  constructor(
    @InjectDataSource('database')
    private dataSource: DataSource,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAlbums(): Promise<Albums[]> {
    return await this.dataSource.manager.find(Albums);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async etAlbumById(@Param('id') id: string): Promise<Albums> {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid album id');
    const album = await this.dataSource.manager.findOneBy<Albums>(Albums, { id: id });
    if (!album) throw new NotFoundException(`Album with id - ${id} not found!`);
    return album;
  }

  @UseGuards(AuthGuard)
  @Post()
  async addAlbum(@Body() album: Partial<Albums>): Promise<Albums> {
    if (!album.name || !album.year)
      throw new BadRequestException('Body does not contain required fields');
    const newAlbum: Albums = new Albums();
    newAlbum.name = album.name;
    newAlbum.year = album.year;
    newAlbum.artistId = album.artistId || null;
    const albumsEntity = this.dataSource.manager.create(Albums, newAlbum);
    await this.dataSource.manager.save(albumsEntity);
    return albumsEntity;
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async editAlbum(
    @Param('id') id: string,
    @Body() albumInfo: Partial<Albums>,
  ): Promise<Albums> {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid album id');
    if (
      !albumInfo.name ||
      !albumInfo.year ||
      !(albumInfo.artistId === null || typeof albumInfo.artistId === 'string')
    )
      throw new BadRequestException('Body does not contain required fields');
    const album: Albums = await this.dataSource.manager.findOneBy<Albums>(Albums, {
      id: id,
    });
    if (!album) throw new NotFoundException(`Album with id - ${id} not found!`);
    album.year = albumInfo.year || album.year;
    album.name = albumInfo.name || album.name;
    album.artistId = albumInfo.artistId || album.artistId;
    await this.dataSource.manager.save(Albums, album);
    return album;
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteAlbum(@Param('id') id: string) {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid album id');
    const albumForDelete = await this.dataSource.manager.findOneBy(Albums, {
      id: id,
    });
    if (!albumForDelete)
      throw new NotFoundException(`Album with id - ${id} not found!`);
    const tracksWithAlbum = await this.dataSource.manager.findBy(Tracks, {
      albumId: id,
    });
    tracksWithAlbum.forEach((value) => (value.albumId = null));
    await this.dataSource.manager.save(Tracks, tracksWithAlbum);
    const album = await this.dataSource.manager.findOneBy(FavoritesAlbums, {
      albumID: id,
    });
    if (album) await this.dataSource.manager.delete(FavoritesAlbums, album);
    return await this.dataSource.manager.delete(Albums, { id: id });
  }
}
