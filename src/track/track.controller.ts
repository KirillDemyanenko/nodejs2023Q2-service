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
import TrackEntity from '../entities/track.entity';
import { isUUID } from 'class-validator';
import { AppService } from '../app.service';

@Controller('track')
export class TrackController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getTracks(): TrackEntity[] {
    return this.appService.trackService.getAll();
  }

  @Get(':id')
  getTrackById(@Param('id') id: string): TrackEntity[] {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid track id');
    if (!this.appService.trackService.get(id))
      throw new NotFoundException(`Track with id - ${id} not found!`);
    return this.appService.trackService.query((data) => data.id === id);
  }

  @Post()
  addTrack(@Body() track: Partial<TrackEntity>): TrackEntity {
    if (typeof track.duration !== 'number' || typeof track.name !== 'string')
      throw new BadRequestException('Body does not contain required fields');
    const newTrack: Pick<
      TrackEntity,
      'name' | 'artistId' | 'albumId' | 'duration'
    > = {
      name: track.name,
      artistId: typeof track.artistId === 'string' ? track.artistId : null,
      albumId: typeof track.albumId === 'string' ? track.albumId : null,
      duration: track.duration,
    };
    return this.appService.trackService.create(newTrack);
  }

  //TODO: Validation of value types
  @Put(':id')
  editTrack(
    @Param('id') id: string,
    @Body() trackInfo: Partial<TrackEntity>,
  ): TrackEntity {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid track id');
    const track: TrackEntity = this.appService.trackService.get(id);
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
    this.appService.trackService.update(track);
    return this.appService.trackService.get(id);
  }

  @HttpCode(204)
  @Delete(':id')
  deleteTrack(@Param('id') id: string) {
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid track id');
    if (!this.appService.trackService.get(id))
      throw new NotFoundException(`Track with id - ${id} not found!`);
    this.appService.favorites.tracks = this.appService.favorites.tracks.filter(
      (tracktId) => {
        return tracktId !== id;
      },
    );
    return this.appService.trackService.delete(id);
  }
}
