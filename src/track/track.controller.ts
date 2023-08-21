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
  Req,
  UseGuards,
} from '@nestjs/common';
import Tracks from '../entities/track.entity';
import { isUUID } from 'class-validator';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { FavoritesTracks } from '../entities/fovorites.entity';
import { AuthGuard } from '../auth/auth.guard';
import { LibraryLogger } from '../logger/logger';

@Controller('track')
export class TrackController {
  constructor(
    @InjectDataSource('database')
    private dataSource: DataSource,
    private readonly logger: LibraryLogger,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async getTracks(): Promise<Tracks[]> {
    return await this.dataSource.manager.find(Tracks);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getTrackById(
    @Param('id') id: string,
    @Req() request: Request,
  ): Promise<Tracks> {
    if (!isUUID(id, 4)) {
      this.logger.error(`Request to - ${request.url} - Invalid track id`);
      throw new BadRequestException('Invalid track id');
    }
    const track = await this.dataSource.manager.findOneBy<Tracks>(Tracks, {
      id: id,
    });
    if (!track) {
      this.logger.error(
        `Request to - ${request.url} - Track with id - ${id} not found!`,
      );
      throw new NotFoundException(`Track with id - ${id} not found!`);
    }
    return track;
  }

  @UseGuards(AuthGuard)
  @Post()
  async addTrack(
    @Body() track: Partial<Tracks>,
    @Req() request: Request,
  ): Promise<Tracks> {
    if (typeof track.duration !== 'number' || typeof track.name !== 'string') {
      this.logger.error(
        `Request to - ${request.url} - Body does not contain required fields`,
      );
      throw new BadRequestException('Body does not contain required fields');
    }
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

  @UseGuards(AuthGuard)
  @Put(':id')
  async editTrack(
    @Param('id') id: string,
    @Body() trackInfo: Partial<Tracks>,
    @Req() request: Request,
  ): Promise<Tracks> {
    if (!isUUID(id, 4)) {
      this.logger.error(`Request to - ${request.url} - Invalid track id`);
      throw new BadRequestException('Invalid track id');
    }
    const track: Tracks = await this.dataSource.manager.findOneBy<Tracks>(
      Tracks,
      {
        id: id,
      },
    );
    if (
      !(typeof trackInfo.name === 'string') ||
      !(typeof trackInfo.duration === 'number') ||
      !(
        trackInfo.artistId === null || typeof trackInfo.artistId === 'string'
      ) ||
      !(trackInfo.albumId === null || typeof trackInfo.albumId === 'string')
    ) {
      this.logger.error(
        `Request to - ${request.url} - Body does not contain required fields`,
      );
      throw new BadRequestException('Body does not contain required fields');
    }
    if (!track) {
      this.logger.error(
        `Request to - ${request.url} - Track with id - ${id} not found!`,
      );
      throw new NotFoundException(`Track with id - ${id} not found!`);
    }
    track.duration = trackInfo.duration;
    track.name = trackInfo.name;
    track.albumId = trackInfo.albumId;
    track.artistId = trackInfo.artistId;
    await this.dataSource.manager.save(Tracks, track);
    return track;
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteTrack(@Param('id') id: string, @Req() request: Request) {
    if (!isUUID(id, 4)) {
      this.logger.error(`Request to - ${request.url} - Invalid track id`);
      throw new BadRequestException('Invalid track id');
    }
    const trackForDelete = await this.dataSource.manager.findOneBy(Tracks, {
      id: id,
    });
    if (!trackForDelete) {
      this.logger.error(
        `Request to - ${request.url} - Track with id - ${id} not found!`,
      );
      throw new NotFoundException(`Track with id - ${id} not found!`);
    }
    const track = await this.dataSource.manager.findOneBy(FavoritesTracks, {
      trackID: id,
    });
    this.logger.log(`Album - ${JSON.stringify(track)} successfully deleted!`);
    if (track) await this.dataSource.manager.delete(FavoritesTracks, track);
    return await this.dataSource.manager.delete(Tracks, { id: id });
  }
}
