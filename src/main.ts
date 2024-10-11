import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'

async function bootstrap() {
	const logger = new Logger('bootstrap')

	const app = await NestFactory.create(AppModule)

	app.setGlobalPrefix('api/v2')

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			// Para transformar query strings en su tipo de dato
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
		}),
	)

	const port = process.env.PORT
	await app.listen(port)
	logger.log(`App running in port: ${port}`)
}
bootstrap()
