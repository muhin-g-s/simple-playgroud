import { IDirectory, IFile, IWriteFile, WorkspaceType } from '../entity';

interface IFileSystem {
	readSync(pathFile: string): Array<IFile | IDirectory>;
	readdirSync(path: string): Array<IDirectory>;
	readFileSync(pathFile: string): IFile;
	writeFileSync({ path, content }: IWriteFile): void;
	existsSync(path: string): boolean;
}

export class WorkspaceUseCase {
	private currentFile: IFile | null = null;

	constructor(
		private readonly fs: IFileSystem,
		private readonly basePath: string = '/'
	) {}

	getWorkspace(): WorkspaceType {
		return this.fs.readSync(this.basePath);
	}

	getCurrentFile(): IFile | null {
		return this.currentFile;
	}

	setCurrentFile(filePath: string): void {
		this.currentFile = this.fs.readFileSync(filePath);
	}

	updateFileContent(content: string): void {
		if(!this.currentFile) {
			console.error('Current file is not set');
			return; 
		}

		const { path } = this.currentFile;

		this.fs.writeFileSync({ path, content });
		this.currentFile.content = content;
	}
}