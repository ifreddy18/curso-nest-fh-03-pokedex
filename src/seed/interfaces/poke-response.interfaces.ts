export interface PokeResponse {
	count: number
	next: string
	previous: null
	results: PokePokemon[]
}

export interface PokePokemon {
	name: string
	url: string
}
