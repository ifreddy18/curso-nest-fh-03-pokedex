import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class Pokemon extends Document {
	@Prop({
		unique: true,
		// Usar index solo para casos de propiedades con mucha lectura y poca o nula escritura
		// como ID's, n
		// https://www.mongodb.com/docs/manual/indexes/
		index: true,
	})
	no: number

	@Prop({
		unique: true,
		index: true,
	})
	name: string
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon)
