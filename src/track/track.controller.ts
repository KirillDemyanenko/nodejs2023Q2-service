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
  UnauthorizedException,
} from '@nestjs/common';
import Tracks from '../entities/track.entity';
import { isUUID } from 'class-validator';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { FavoritesTracks } from '../entities/fovorites.entity';

@Controller('track')
export class TrackController {
  constructor(
    @InjectDataSource('database')
    private dataSource: DataSource,
  ) {}

  @Get()
  async getTracks(@Req() req: Request): Promise<Tracks[]> {
    if (!req.headers['authorization']) throw new UnauthorizedException();
    return await this.dataSource.manager.find(Tracks);
  }

  @Get(':id')
  async getTrackById(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<Tracks> {
    if (!req.headers['authorization']) throw new UnauthorizedException();
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid track id');
    const track = await this.dataSource.manager.findOneBy(Tracks, { id: id });
    if (!track) throw new NotFoundException(`Track with id - ${id} not found!`);
    return track;
  }

  @Post()
  async addTrack(
    @Req() req: Request,
    @Body() track: Partial<Tracks>,
  ): Promise<Tracks> {
    if (!req.headers['authorization']) throw new UnauthorizedException();
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
    @Req() req: Request,
    @Param('id') id: string,
    @Body() trackInfo: Partial<Tracks>,
  ): Promise<Tracks> {
    if (!req.headers['authorization']) throw new UnauthorizedException();
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
  async deleteTrack(@Req() req: Request, @Param('id') id: string) {
    if (!req.headers['authorization']) throw new UnauthorizedException();
    if (!isUUID(id, 4)) throw new BadRequestException('Invalid track id');
    const trackForDelete = await this.dataSource.manager.findOneBy(Tracks, {
      id: id,
    });
    if (!trackForDelete)
      throw new NotFoundException(`Track with id - ${id} not found!`);
    const track = await this.dataSource.manager.findOneBy(FavoritesTracks, {
      trackID: id,
    });
    if (track) await this.dataSource.manager.delete(FavoritesTracks, track);
    return await this.dataSource.manager.delete(Tracks, { id: id });
  }
}
