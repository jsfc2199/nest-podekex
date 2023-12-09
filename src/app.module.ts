import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    //referencia a la base de datos
    MongooseModule.forRoot('mongodb://localhost:27017/nest-pokemon'), //el argumengo es la url de la base de datos
    PokemonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
