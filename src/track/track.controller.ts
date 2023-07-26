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
import TrackEntity from '../entities/track.entity';
import { isUUID } from 'class-validator';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: InMemoryDBService<TrackEntity>) {}

  @Get()
  getTracks(): TrackEntity[] {
    return this.trackService.getAll();
  }

  @Get(':id')
  getTrackById(@Param('id') id: string): TrackEntity[] {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid track id');
    if (!this.trackService.get(id))
      throw new NotFoundException(`Track with id - ${id} not found!`);
    return this.trackService.query((data) => data.id === id);
  }

  //TODO: Artist and Album Validation
  @Post()
  addTrack(@Body() track: Partial<TrackEntity>): TrackEntity {
    if (!track.duration || !track.name)
      throw new BadRequestException('Body does not contain required fields');
    const newTrack: Pick<
      TrackEntity,
      'name' | 'artistId' | 'albumId' | 'duration'
    > = {
      name: track.name,
      artistId: track.artistId || null,
      albumId: track.albumId || null,
      duration: track.duration,
    };
    return this.trackService.create(newTrack);
  }

  //TODO: Validation of value types
  @Put(':id')
  editTrack(
    @Param('id') id: string,
    @Body() trackInfo: Partial<TrackEntity>,
  ): void {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid track id');
    const track: TrackEntity = this.trackService.get(id);
    if (!track) throw new NotFoundException(`Track with id - ${id} not found!`);
    track.duration = trackInfo.duration || track.duration;
    track.name = trackInfo.name || track.name;
    track.albumId = trackInfo.albumId || track.albumId;
    track.artistId = trackInfo.artistId || track.artistId;
    return this.trackService.update(track);
  }

  @HttpCode(204)
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid track id');
    if (!this.trackService.get(id))
      throw new NotFoundException(`Track with id - ${id} not found!`);
    return this.trackService.delete(id);
  }
}
