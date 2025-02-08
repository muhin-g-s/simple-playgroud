import { DefaultInitializationStrategy, MemFileSystem } from '../repository';
import { WorkspaceUseCase } from '../use-case';
import { IWorkspaceUseCase } from './types';

let workspaceUseCase: IWorkspaceUseCase | null = null;

export async function getFileSystem(): Promise<IWorkspaceUseCase> {
	if (!workspaceUseCase) {
		const initState = new DefaultInitializationStrategy();
		const fs = new MemFileSystem(initState);
		await fs.initialize();
		workspaceUseCase =  new WorkspaceUseCase(fs);
	}
	
	return workspaceUseCase;
}