import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private defaultLimit: number;
  constructor(
    @InjectModel(Pokemon.name) //usamos el injectModel para indicar que el modelo será inyectable de manera controlada basada en nest
    private readonly pokemonModel: Model<Pokemon>, //usamos model de mongoose con el generico de nuestro pokemon
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit');
  }
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    return this.pokemonModel.find().limit(limit).skip(offset).sort({ no: 1 }); //el {no: 1} es para ordenar ascendente por la columna no
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    //isValidObjectId sirve para buscar por el id que asigna mongo
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term); //se usa findById para tener relacion directa con el id de mongo
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }

    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name or no ${term} not found`,
      );
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term); //usamos el finOne del propio servicio
    //al no saber si term es el id, el numero, o el id no podemos hacer this.pokemonModel.findByIdAndUpdate, si fuera por id si se podría hacer
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    try {
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto }; //reemplazamos la data del pokemon y las sobreescribimos con lo nuevo
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    //forma tradicional es usando this.pokemonModel.findByIdAndDelete para usar customPipes eventualmente
    // const pokemon = await this.findOne(id); //con findOne eliminariamos por termino como no, o name
    // await pokemon.deleteOne();

    //lo anterior funciona correctamente, pero queremos eliminar bsado siempre en el id, y asegurandonos que sea un mongo id
    //con la implementacion del custom pipe ya podemos usar el findByIDAndDelete
    // const result = await this.pokemonModel.findByIdAndDelete(id);
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0)
      throw new BadRequestException(`Pokemon with id ${id}, not found`);
    return;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon already exits in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    throw new InternalServerErrorException(
      `Cant't create pokemon-Check Server Logs`,
    );
  }
}
