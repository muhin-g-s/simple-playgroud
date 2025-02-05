export type WorkspaceType = Array<WorkspaceItem>;
export type WorkspaceItem = IFile | IDirectory;

interface IFile {
	readonly name: string;
	readonly path: string;
	readonly content: string;
}

interface IDirectory {
	readonly name: string;
	readonly path: string;
	readonly children: Array<IFile | IDirectory>;
}