import { Injectable } from '@nestjs/common'
import { HttpAdapter } from '../interfaces/http-adapter.interface'

@Injectable()
export class FetchAdapter implements HttpAdapter {
	async get<T>(url: string): Promise<T> {
		try {
			const response = await fetch(url)
			return (await response.json()) as T
		} catch (error) {
			console.log(error)
			throw new Error('This is an error - Check logs')
		}
	}
}
