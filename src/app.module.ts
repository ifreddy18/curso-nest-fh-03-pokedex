import { join } from 'path'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { MongooseModule } from '@nestjs/mongoose'
// Config
import { EnvConfiguration, JoiValidationSchema } from './config'
// Modules
import { PokemonModule } from './pokemon/pokemon.module'
import { CommonModule } from './common/common.module'
import { SeedModule } from './seed/seed.module'

@Module({
	imports: [
		// env
		ConfigModule.forRoot({
			load: [EnvConfiguration],
			validationSchema: JoiValidationSchema,
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'public'),
		}),
		// Connect to DB
		MongooseModule.forRoot('mongodb://localhost:27017/nest-pokemon'),
		// Modules
		CommonModule,
		PokemonModule,
		SeedModule,
	],
})
export class AppModule {
	constructor() {
		// console.log(process.env)
	}
}
