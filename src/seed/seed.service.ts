import { Injectable } from '@nestjs/common'
import { PokeResponse } from './interfaces/poke-response.interfaces'
import { Pokemon } from 'src/pokemon/entities/pokemon.entity'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { FetchAdapter } from 'src/common/adapters/fetch.adapter'

@Injectable()
export class SeedService {
	constructor(
		@InjectModel(Pokemon.name)
		private readonly pokemonModel: Model<Pokemon>,
		private readonly http: FetchAdapter,
	) {}

	async executeSeed() {
		// Delete DB
		await this.pokemonModel.deleteMany({}) // delete * from pokemons

		const data = await this.http.get<PokeResponse>(
			'https://pokeapi.co/api/v2/pokemon?limit=650',
		)

		const pokemonToInsert: { name: string; no: number }[] = []

		data.results.forEach(async ({ name, url }) => {
			const segments = url.split('/')
			const no: number = +segments[segments.length - 2] // Penultima
			pokemonToInsert.push({ name, no })
		})

		await this.pokemonModel.insertMany(pokemonToInsert)

		return 'Seed executed'
	}
}
