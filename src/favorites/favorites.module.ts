import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService, InMemoryDBService],
})
export class FavoritesModule {}
