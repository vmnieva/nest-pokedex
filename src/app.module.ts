import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    // Configura el módulo para servir archivos estáticos desde la carpeta 'public'
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    // Conecta la aplicación con la base de datos MongoDB local usando Mongoose
    MongooseModule.forRoot('mongodb://localhost:27017/nest-pokemon'),

    // Importa el módulo de Pokémon para registrar sus rutas y servicios
    PokemonModule,

    CommonModule,

    SeedModule
  ],
})
export class AppModule {}
