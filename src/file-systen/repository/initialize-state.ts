import { IInitializationStrategy } from './types';

export class DefaultInitializationStrategy implements IInitializationStrategy {
	async getInitialState(): Promise<{ [path: string]: string }> {
		return {
			"/welcome.txt": "Welcome to the Simple Text Editor!",
			"/example.txt": "This is an example file.",
		}
	}
}