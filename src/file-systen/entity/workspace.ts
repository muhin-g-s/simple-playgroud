export interface IWorkspace {
	workspace: Array<IFile | IDirectory>;
}

interface IFile {
	readonly name: string;
	readonly path: string;
}

interface IDirectory {
	readonly name: string;
	readonly path: string;
	readonly children: Array<IFile | IDirectory>;
}