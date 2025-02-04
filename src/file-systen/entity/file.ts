export interface IFile {
	readonly name: string;
	readonly path: string;
	content: string;
}

export interface IDirectory {
	readonly name: string;
	readonly path: string;
	readonly children: Array<IFile | IDirectory>;
}

export interface IWriteFile {
	path: string;
	content: string;
}