import { IFile, IWorkspace, IWriteFile } from '../entity';

export interface IWorkspaceUseCase {
	getWorkspace(): IWorkspace;

	getCurrentFile(): IFile | null;

	setCurrentFile(filePath: string): void;

	updateFileContent(writeFile: IWriteFile): void;
}