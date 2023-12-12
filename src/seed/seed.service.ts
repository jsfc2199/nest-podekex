import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-resp.interface';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}
  async executeSeed() {
    await this.pokemonModel.deleteMany({}); //equivale al delete * from pokemons y queremos limpiar la data cada que ejecutemos el seed
    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );
    // Forma 1 para crear simultanemante inserciones
    // const insertPromisesArray = [];
    // data.results.forEach(({ name, url }) => {
    //   const segmets = url.split('/');
    //   const no: number = +segmets[segmets.length - 2]; //el id del pokemon es el penultimo segmento
    //   // await this.pokemonModel.create({ name, no }); //creamos por lotes los pokemon
    //   insertPromisesArray.push(this.pokemonModel.create({ name, no }));
    // });

    // await Promise.all(insertPromisesArray);

    //forma dos
    const pokemonToInsert: { name: string; no: number }[] = [];
    data.results.forEach(({ name, url }) => {
      const segmets = url.split('/');
      const no: number = +segmets[segmets.length - 2];
      pokemonToInsert.push({ name, no });
    });
    await this.pokemonModel.insertMany(pokemonToInsert);
    return 'seed executed';
  }
}
