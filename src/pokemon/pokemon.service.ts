import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { CreatePokemonDto } from './dto/create-pokemon.dto'
import { UpdatePokemonDto } from './dto/update-pokemon.dto'
import { Model, isValidObjectId } from 'mongoose'
import { Pokemon } from './entities/pokemon.entity'
import { InjectModel } from '@nestjs/mongoose'
import { MongoError } from 'src/utils/MongoHandleErros'
import { PaginationDto } from 'src/common/dto/pagination.dto'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PokemonService {
	private defaultLimit: number

	constructor(
		@InjectModel(Pokemon.name)
		private readonly pokemonModel: Model<Pokemon>,
		private readonly configService: ConfigService,
	) {
		this.defaultLimit = configService.get<number>('defaultLimit')
	}

	async create(createPokemonDto: CreatePokemonDto) {
		createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase()
		try {
			const pokemon = await this.pokemonModel.create(createPokemonDto)
			return pokemon
		} catch (error) {
			this.handleExceptions(error, 'create')
		}
	}

	findAll(paginationDto: PaginationDto) {
		const { limit = this.defaultLimit, offset = 0 } = paginationDto
		return (
			this.pokemonModel
				.find()
				.limit(limit)
				.skip(offset)
				// no: 1 => no Ascendente
				.sort({ no: 1 })
		)
	}

	async findOne(term: string) {
		let pokemon: Pokemon

		// no
		if (!isNaN(+term)) {
			pokemon = await this.pokemonModel.findOne({ no: term })
		}
		// MongoID
		else if (isValidObjectId(term)) {
			pokemon = await this.pokemonModel.findById(term)
		}
		// name
		else {
			pokemon = await this.pokemonModel.findOne({
				name: term.toLocaleLowerCase(),
			})
		}

		if (!pokemon)
			throw new NotFoundException(
				`Pokemon with id, name or no "${term}" not found`,
			)

		return pokemon
	}

	async update(term: string, updatePokemonDto: UpdatePokemonDto) {
		const pokemon = await this.findOne(term)

		if (updatePokemonDto.name)
			updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase()

		try {
			await pokemon.updateOne(updatePokemonDto)
			return { ...pokemon.toJSON(), ...updatePokemonDto }
		} catch (error) {
			this.handleExceptions(error, 'update')
		}
	}

	async remove(id: string) {
		// const pokemon = await this.findOne(id)
		// await pokemon.deleteOne()
		// const result = await this.pokemonModel.findByIdDelete(id)
		const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id })
		if (deletedCount === 0)
			throw new BadRequestException(`Pokemon with id "${id}" not found`)
	}

	private handleExceptions = (error: any, unhandleErrorWordForMsg: string) => {
		if (error.code === MongoError.DuplicateKey) {
			throw new BadRequestException(
				`Pokemon exists in db ${JSON.stringify(error.keyValue)}`,
			)
		}
		console.log({ handleExceptionsError: error })
		throw new InternalServerErrorException(
			`Cant't ${unhandleErrorWordForMsg} Pokemon - Check server logs`,
		)
	}
}
