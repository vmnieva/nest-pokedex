import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


// Define esta clase como un Schema de Mongoose para MongoDB
@Schema()
export class Pokemon extends Document {

    // id: string Mongo me lo da

    // Propiedad 'name' con índice y valor único en la base de datos
    @Prop({
        unique: true,
        index: true,
    })
    name: string;

    // Propiedad 'no' (número de pokedex) con índice y valor único
    @Prop({
        unique: true,
        index: true,
    })
    no: number;
}


// Genera el esquema de Mongoose a partir de la clase TypeScript
export const PokemonSchema = SchemaFactory.createForClass( Pokemon );