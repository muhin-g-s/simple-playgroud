import { IDirectory, IFile, IWriteFile } from '../entity';

export interface IInitializationStrategy {
  getInitialState(): Promise<{ [path: string]: string }>
}

export interface IFileSystem {
	readSync(pathFile: string): Array<IFile | IDirectory>;
	readdirSync(path: string): Array<IDirectory>;
	readFileSync(pathFile: string): IFile;
	writeFileSync({ path, content }: IWriteFile): void;
	existsSync(path: string): boolean;
}