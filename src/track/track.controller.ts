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
import Tracks from '../entities/track.entity';
import { isUUID } from 'class-validator';
import { AppService } from '../app.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import Artists from '../entities/artist.entity';
import Users from '../entities/user.entity';

@Controller('track')
export class TrackController {
  constructor(
    @InjectDataSource('database')
    private dataSource: DataSource,
  ) {}

  @Get()
  async getTracks(): Promise<Tracks[]> {
    return await this.dataSource.manager.find(Tracks);
  }

  @Get(':id')
  async getTrackById(@Param('id') id: string): Promise<Tracks> {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid track id');
    const track = await this.dataSource.manager.findOneBy(Tracks, { id: id });
    if (!track) throw new NotFoundException(`Track with id - ${id} not found!`);
    return track;
  }

  @Post()
  async addTrack(@Body() track: Partial<Tracks>): Promise<Tracks> {
    if (typeof track.duration !== 'number' || typeof track.name !== 'string')
      throw new BadRequestException('Body does not contain required fields');
    const newTrack: Tracks = new Tracks();
    newTrack.name = track.name;
    newTrack.artistId =
      typeof track.artistId === 'string' ? track.artistId : null;
    newTrack.albumId = typeof track.albumId === 'string' ? track.albumId : null;
    newTrack.duration = track.duration;
    const tracksEntity = this.dataSource.manager.create(Tracks, newTrack);
    await this.dataSource.manager.save(tracksEntity);
    return tracksEntity;
  }

  @Put(':id')
  async editTrack(
    @Param('id') id: string,
    @Body() trackInfo: Partial<Tracks>,
  ): Promise<Tracks> {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid track id');
    const track: Tracks = await this.dataSource.manager.findOneBy(Tracks, {
      id: id,
    });
    if (
      !(typeof trackInfo.name === 'string') ||
      !(typeof trackInfo.duration === 'number') ||
      !(
        trackInfo.artistId === null || typeof trackInfo.artistId === 'string'
      ) ||
      !(trackInfo.albumId === null || typeof trackInfo.albumId === 'string')
    )
      throw new BadRequestException('Body does not contain required fields');
    if (!track) throw new NotFoundException(`Track with id - ${id} not found!`);
    track.duration = trackInfo.duration;
    track.name = trackInfo.name;
    track.albumId = trackInfo.albumId;
    track.artistId = trackInfo.artistId;
    await this.dataSource.manager.save(Tracks, track);
    return track;
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteTrack(@Param('id') id: string) {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid track id');
    const trackForDelete = await this.dataSource.manager.findOneBy(Artists, {
      id: id,
    });
    if (!trackForDelete)
      throw new NotFoundException(`Track with id - ${id} not found!`);
    // this.appService.favorites.tracks = this.appService.favorites.tracks.filter(
    //   (tracktId) => {
    //     return tracktId !== id;
    //   },
    // );
    return await this.dataSource.manager.delete(Tracks, { id: id });
  }
}
