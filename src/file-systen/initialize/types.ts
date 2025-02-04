import { IFile, WorkspaceType, IWriteFile } from '../entity';

export interface IWorkspaceUseCase {
	getWorkspace(): WorkspaceType;

	getCurrentFile(): IFile | null;

	setCurrentFile(filePath: string): void;

	updateFileContent(writeFile: IWriteFile): void;
}