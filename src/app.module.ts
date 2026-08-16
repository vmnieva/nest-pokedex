import { SeedModule } from './seed/seed.module';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      load:[EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    // Configura el módulo para servir archivos estáticos desde la carpeta 'public'
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    // Conecta la aplicación con la base de datos MongoDB local usando Mongoose
    MongooseModule.forRoot(process.env.MONGODB!), 
    //La admiracion es porque puede ser undefined y eso no puede ocurrir, 
    //para indicar que no va a ser undefined se pone !

    // Importa el módulo de Pokémon para registrar sus rutas y servicios
    PokemonModule,

    CommonModule,
    
    SeedModule,
    
  ],
})
export class AppModule {

  constructor(){
  }
}
