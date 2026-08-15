import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function main() {
  // Crea la instancia de la aplicación NestJS basada en el módulo raíz
  const app = await NestFactory.create(AppModule);

  // Establece un prefijo global para todas las rutas de la API (ej: /api/v2/pokemon)
  app.setGlobalPrefix('api/v2');

  // Configura los tubos (pipes) de validación globales para toda la app
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no estén en los DTOs
      forbidNonWhitelisted: true, // Lanza error si envían propiedades no permitidas
    })
  );

  // Inicia la aplicación en el puerto configurado (por defecto el 3000)
  await app.listen(process.env.PORT ?? 3000);
}
main();
