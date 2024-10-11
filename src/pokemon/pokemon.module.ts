import { Module } from '@nestjs/common'
import { PokemonService } from './pokemon.service'
import { PokemonController } from './pokemon.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Pokemon, PokemonSchema } from './entities/pokemon.entity'
import { ConfigModule } from '@nestjs/config'

@Module({
	controllers: [PokemonController],
	providers: [PokemonService],
	imports: [
		// Config
		ConfigModule,
		// DB
		MongooseModule.forFeature([
			{
				// Pokemon.name NO es la propiedad name del Pokemon
				name: Pokemon.name,
				schema: PokemonSchema,
			},
		]),
	],
	exports: [
		MongooseModule, // Para exportar entities
	],
})
export class PokemonModule {}
