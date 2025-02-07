import { ESBuild } from './esbuild-builder';
import { IBuilder } from './interfaces';

let builder: IBuilder | null  = null; 

export function createEsBuilder(): IBuilder {
	if(!builder) {
		builder = new ESBuild(); 
	}

	return builder;
}