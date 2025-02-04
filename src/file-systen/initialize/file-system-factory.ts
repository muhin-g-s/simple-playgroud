import { DefaultInitializationStrategy, MemFileSystem } from '../repository';
import { WorkspaceUseCase } from '../use-case';
import { IWorkspaceUseCase } from './types';

export function createFileSystem(): IWorkspaceUseCase {
		const initState = new DefaultInitializationStrategy();
		const fs = new MemFileSystem(initState);
		return new WorkspaceUseCase(fs);
}