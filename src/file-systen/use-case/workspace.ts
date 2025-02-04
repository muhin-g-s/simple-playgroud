import { IDirectory, IFile, IWriteFile, IWorkspace } from '../entity';

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

	getWorkspace(): IWorkspace {
		const workspace = this.fs.readSync(this.basePath);

		return {
			workspace
		};
	}

	getCurrentFile(): IFile | null {
		return this.currentFile;
	}

	setCurrentFile(filePath: string): void {
		this.currentFile = this.fs.readFileSync(filePath);
	}

	updateFileContent(writeFile: IWriteFile): void {
		this.fs.writeFileSync(writeFile);
	}
}