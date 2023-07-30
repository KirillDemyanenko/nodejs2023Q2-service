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
import AlbumEntity from '../entities/album.entity';
import { AppService } from '../app.service';

@Controller('album')
export class AlbumController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getAlbums(): AlbumEntity[] {
    return this.appService.albumService.getAll();
  }

  @Get(':id')
  getAlbumById(@Param('id') id: string): AlbumEntity[] {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid album id');
    if (!this.appService.albumService.get(id))
      throw new NotFoundException(`Album with id - ${id} not found!`);
    return this.appService.albumService.query((data) => data.id === id);
  }

  @Post()
  addAlbum(@Body() album: Partial<AlbumEntity>): AlbumEntity {
    if (!album.name || !album.year)
      throw new BadRequestException('Body does not contain required fields');
    const newAlbum: Pick<AlbumEntity, 'name' | 'year' | 'artistId'> = {
      name: album.name,
      year: album.year,
      artistId: album.artistId || null,
    };
    return this.appService.albumService.create(newAlbum);
  }

  @Put(':id')
  editAlbum(
    @Param('id') id: string,
    @Body() albumInfo: Partial<AlbumEntity>,
  ): AlbumEntity {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid album id');
    if (
      !albumInfo.name ||
      !albumInfo.year ||
      !(albumInfo.artistId === null || typeof albumInfo.artistId === 'string')
    )
      throw new BadRequestException('Body does not contain required fields');
    const album: AlbumEntity = this.appService.albumService.get(id);
    if (!album) throw new NotFoundException(`Album with id - ${id} not found!`);
    album.year = albumInfo.year || album.year;
    album.name = albumInfo.name || album.name;
    album.artistId = albumInfo.artistId || album.artistId;
    this.appService.albumService.update(album);
    return this.appService.albumService.get(id);
  }

  @HttpCode(204)
  @Delete(':id')
  deleteAlbum(@Param('id') id: string) {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid album id');
    if (!this.appService.albumService.get(id))
      throw new NotFoundException(`Album with id - ${id} not found!`);
    this.appService.favorites.albums = this.appService.favorites.albums.filter(
      (albumtId) => {
        return albumtId !== id;
      },
    );
    return this.appService.albumService.delete(id);
  }
}
