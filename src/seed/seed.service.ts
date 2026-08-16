import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interfaces';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
  private readonly http: AxiosAdapter,
  @InjectModel(Pokemon.name)
      private readonly pokemonModel: Model<Pokemon>,
  ){}
  

  async executeSeed() {
    await this.pokemonModel.deleteMany();
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');
    let pokemonsToInsert: CreatePokemonDto[] = [];

    //Si queremos hacer una llamada a un servicio como seria await this.pokemonService
    //en un forEach, este debe de tener el async: data.results.forEach(async({name, url}) =>{
    //data.results.forEach(async({name, url}) =>{ const data await this.pokemonService;
    data.results.forEach(({name, url}) =>{
      const segments = url.split('/');
      const no:number = +segments[segments.length - 2];
      pokemonsToInsert.push({no , name});
    });
    return await this.pokemonModel.insertMany(pokemonsToInsert);
  }

  // async executeSeedEjemplo() {
  //   await this.pokemonModel.deleteMany();
  //   const {data} = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');
  //   const inserPromisesArray = [];
  //   data.results.forEach(({name, url}) =>{
  //     const segments = url.split('/');
  //     const no:number = +segments[segments.length - 2];
  //     inserPromisesArray.push(
  //       this.pokemonModel.create({no, name}) igualmente esto me da error
  //     );
  //   });
  // }

}
