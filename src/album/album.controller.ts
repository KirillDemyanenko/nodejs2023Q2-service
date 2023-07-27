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
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { isUUID } from 'class-validator';
import AlbumEntity from '../entities/album.entity';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: InMemoryDBService<AlbumEntity>) {}

  @Get()
  getArtists(): AlbumEntity[] {
    return this.albumService.getAll();
  }

  @Get(':id')
  getArtistById(@Param('id') id: string): AlbumEntity[] {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid album id');
    if (!this.albumService.get(id))
      throw new NotFoundException(`Album with id - ${id} not found!`);
    return this.albumService.query((data) => data.id === id);
  }

  @Post()
  addArtist(@Body() album: Partial<AlbumEntity>): AlbumEntity {
    if (!album.name || !album.year)
      throw new BadRequestException('Body does not contain required fields');
    const newAlbum: Pick<AlbumEntity, 'name' | 'year' | 'artistId'> = {
      name: album.name,
      year: album.year,
      artistId: album.artistId || null,
    };
    return this.albumService.create(newAlbum);
  }

  @Put(':id')
  editArtist(
    @Param('id') id: string,
    @Body() albumInfo: Partial<AlbumEntity>,
  ): void {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid album id');
    const album: AlbumEntity = this.albumService.get(id);
    if (!album) throw new NotFoundException(`Album with id - ${id} not found!`);
    album.year = albumInfo.year || album.year;
    album.name = albumInfo.name || album.name;
    album.artistId = albumInfo.artistId || album.artistId;
    return this.albumService.update(album);
  }

  @HttpCode(204)
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid album id');
    if (!this.albumService.get(id))
      throw new NotFoundException(`Album with id - ${id} not found!`);
    return this.albumService.delete(id);
  }
}
