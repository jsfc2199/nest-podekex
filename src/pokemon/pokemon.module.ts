import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Pokemon.name, //el .name es la propiedad que tiene la clase al extender de document, mas no el atributo name
        schema: PokemonSchema,
      },
    ]),
  ],
  exports: [MongooseModule], //lo exportamos para tener acceso a lo que se hace sobre pokemon por fuera de este modulo
})
export class PokemonModule {}
