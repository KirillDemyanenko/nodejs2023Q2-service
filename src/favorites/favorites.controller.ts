import { Controller, Get } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import FavoritesEntity from '../entities/fovorites.entity';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getArtists(): FavoritesEntity[] {
    return this.favoritesService.getAll();
  }
}
