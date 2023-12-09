import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Pokemon extends Document {
  // id: string //mongo lo da

  @Prop({
    unique: true,
    index: true, //sabe donde está el elemento que estaos buscando
  })
  name: string;

  @Prop({
    unique: true,
    index: true,
  })
  no: number;
}

//exportamos el equema para que se tengan las definiciones de lo que queremos en la base de datos
export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
