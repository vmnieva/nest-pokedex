import { IsInt, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {

    // Valida que 'no' sea un número entero, positivo y con un valor mínimo de 1
    @IsInt()
    @IsPositive()
    @Min(1)
    no: number;

    // Valida que 'name' sea un string con al menos 1 carácter de longitud
    @IsString()
    @MinLength(1)
    name: string;
}
