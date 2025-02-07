export interface IBuilder {
	addFile(filePath: string, content: string): void;
	setEntryPoint(entryPoint: string): void;
	rebuildProject(): Promise<void>;
}