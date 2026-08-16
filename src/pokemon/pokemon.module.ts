import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    // Registra el modelo Mongoose para la entidad Pokemon en este módulo específico
    MongooseModule.forFeature([
      {
      name: Pokemon.name,
      schema: PokemonSchema,
      }
    ])
  ],
  exports: [
    PokemonService, 
    MongooseModule
  ],
})
export class PokemonModule {}
