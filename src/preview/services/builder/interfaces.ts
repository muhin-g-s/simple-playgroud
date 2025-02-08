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