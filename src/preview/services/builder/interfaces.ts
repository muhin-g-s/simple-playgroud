import { WorkspaceType } from '../../../file-systen';

export interface IBuilder {
	addFile(filePath: string, content: string): void;
	setEntryPoint(entryPoint: string): void;
	rebuildProject(): Promise<void>;
}

export interface IBuilderConfig {
	extensions: string[];
  workingDir: string;
  nodeModulesPaths: string[];
  onExternalPackage: (pkg: string) => void;
  onOutputGenerated: (outputFiles: string[]) => void;
  getExternalPackageContent: (pkg: string) => string;
}

export interface IBuilderUseCase {
	setEntryPoint(entryPoint: string): void;
	rebuildProject(): Promise<void>;
	addFile(filePath: string, content: string): void;
	addWorkspace(workspace: WorkspaceType): void
}