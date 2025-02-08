import { IFile, WorkspaceType } from '../entity';

export interface IWorkspaceUseCase {
	getWorkspace(): WorkspaceType;

	getCurrentFile(): IFile | null;

	setCurrentFile(filePath: string): void;

	updateFileContent(content: string): void;
}