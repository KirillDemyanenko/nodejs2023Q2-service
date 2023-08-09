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
  //
  // @Post()
  // addTrack(@Body() track: Partial<Tracks>): Tracks {
  //   if (typeof track.duration !== 'number' || typeof track.name !== 'string')
  //     throw new BadRequestException('Body does not contain required fields');
  //   const newTrack: Pick<Tracks, 'name' | 'artistId' | 'albumId' | 'duration'> =
  //     {
  //       name: track.name,
  //       artistId: typeof track.artistId === 'string' ? track.artistId : null,
  //       albumId: typeof track.albumId === 'string' ? track.albumId : null,
  //       duration: track.duration,
  //     };
  //   return this.appService.trackService.create(newTrack);
  // }
  //
  // //TODO: Validation of value types
  // @Put(':id')
  // editTrack(
  //   @Param('id') id: string,
  //   @Body() trackInfo: Partial<Tracks>,
  // ): Tracks {
  //   if (!isUUID(id, 4)) throw new BadRequestException('Invalid track id');
  //   const track: Tracks = this.appService.trackService.get(id);
  //   if (
  //     !(typeof trackInfo.name === 'string') ||
  //     !(typeof trackInfo.duration === 'number') ||
  //     !(
  //       trackInfo.artistId === null || typeof trackInfo.artistId === 'string'
  //     ) ||
  //     !(trackInfo.albumId === null || typeof trackInfo.albumId === 'string')
  //   )
  //     throw new BadRequestException('Body does not contain required fields');
  //   if (!track) throw new NotFoundException(`Track with id - ${id} not found!`);
  //   track.duration = trackInfo.duration;
  //   track.name = trackInfo.name;
  //   track.albumId = trackInfo.albumId;
  //   track.artistId = trackInfo.artistId;
  //   this.appService.trackService.update(track);
  //   return this.appService.trackService.get(id);
  // }
  //
  // @HttpCode(204)
  // @Delete(':id')
  // deleteTrack(@Param('id') id: string) {
  //   // if (!isUUID(id, 4)) throw new BadRequestException('Invalid track id');
  //   // if (!this.appService.trackService.get(id))
  //   //   throw new NotFoundException(`Track with id - ${id} not found!`);
  //   // this.appService.favorites.tracks = this.appService.favorites.tracks.filter(
  //   //   (tracktId) => {
  //   //     return tracktId !== id;
  //   //   },
  //   // );
  //   // return this.appService.trackService.delete(id);
  // }
}
