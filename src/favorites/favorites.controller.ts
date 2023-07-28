import { Controller, Get } from '@nestjs/common';
import { AppService } from '../app.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: AppService) {}

  @Get()
  getTrack() {
    return this.favoritesService.getFavorites();
  }
}
