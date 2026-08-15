import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PasrseMongoIdPipe } from 'src/common/pipes/pasrse-mongo-id/pasrse-mongo-id.pipe';

// Define la ruta base para este controlador: /api/v2/pokemon
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  // Endpoint POST para crear un nuevo Pokémon
  @Post()
  // @HttpCode( HttpStatus.OK )
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  // Endpoint GET para obtener todos los Pokémon
  @Get()
  findAll() {
    return this.pokemonService.findAll();
  }

  // Endpoint GET para buscar un Pokémon por término (id, no o nombre)
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.pokemonService.findOne(term);
  }

  // Endpoint PATCH para actualizars un Pokémon
  @Patch(':term')
  update(@Param('term') term: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.update( term, updatePokemonDto);
  }

  // Endpoint DELETE para eliminar un Pokémon por ID
  @Delete(':id')
  remove(@Param('id', PasrseMongoIdPipe) id: string) {
    return this.pokemonService.remove(id);
  }
}
