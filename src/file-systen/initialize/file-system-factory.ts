import { DefaultInitializationStrategy, MemFileSystem } from '../repository';
import { WorkspaceUseCase } from '../use-case';
import { IWorkspaceUseCase } from './types';

export async function createFileSystem(): Promise<IWorkspaceUseCase> {
		const initState = new DefaultInitializationStrategy();
		const fs = new MemFileSystem(initState);
		await fs.initialize();
		return new WorkspaceUseCase(fs);
}