import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  // Inyecta el modelo de Mongoose para interactuar con la colección de Pokemons en MongoDB
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ){}

  // Crea un nuevo Pokémon en la base de datos manejando errores de duplicados (código 11000)
  async create(createPokemonDto: CreatePokemonDto) {
    // Convierte el nombre a minúsculas antes de guardarlo
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      // Intenta crear y guardar el documento en la base de datos
      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return pokemon;
    } catch (error) {
      this.handleException(error);
    }

  }

  // Método para retornar todos los pokemons
  async findAll() {
    return await this.pokemonModel.find();
  }

  // Busca un Pokémon por número, ID de MongoDB o por nombre
  async findOne(term: string) {
    let pokemon: Pokemon | null = null;

    // Si el término es un número, busca por el número (no) del Pokémon
    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({ no: +term });
    }
    
    // Si no se encontró y es un ID válido de MongoDB, busca por su _id
    if(!pokemon && isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById(term);
    }

    // Si aún no se encuentra, busca por su nombre (en minúsculas y sin espacios extra)
    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() });
    }

    // Si definitivamente no existe, lanza una excepción 404 Not Found
    if(!pokemon){
      throw new NotFoundException(`Pokemon whit id, name or "${term}" not found`)
    }
    return pokemon;
  }

  // Actualiza un Pokémon existente buscando primero por término (id, no o nombre)
  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    // Primero busca el Pokémon; si no existe, findOne lanzará un NotFoundException automáticamente
    const pokemon = await this.findOne(term);

    // Si el usuario envió un nuevo nombre, lo convierte a minúsculas
    if(updatePokemonDto && updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    
    try {

      // Actualiza el documento en la base de datos
      await pokemon.updateOne(updatePokemonDto, {new : true});

      // Convierte el documento de Mongoose a JSON plano y le esparce las propiedades actualizadas encima
      return {...pokemon.toJSON(), ...updatePokemonDto};

    } catch (error) {

      this.handleException(error);

    }

  }

  // Método pendiente o inicial para eliminar un Pokémon
  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    // return {id};
    // const result = await this.pokemonModel.findByIdAndDelete(id);

    const {deletedCount} = await this.pokemonModel.deleteOne({ _id: id});
    
    if(deletedCount === 0) throw new BadRequestException(`Pokemon with id "${ id }" not found`);
    
    return;
  }


  private handleException(error: any){

    // Si el código de error es 11000, significa que hay una clave duplicada (violación de unique)
    if(error.code === 11000) {
      throw new BadRequestException(`Pokemon exists en db ${ JSON.stringify(error.keyValue)}`);
    }

    // Para cualquier otro error inesperado, lanza un error de servidor
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);

  }

}
