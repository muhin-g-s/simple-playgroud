import { IFile, WorkspaceItem, WorkspaceType } from '../../../file-systen';
import { IBuilder } from './interfaces';

export class BuilderUseCase {
	constructor(private readonly builder: IBuilder) {}

	setEntryPoint(entryPoint: string): void {
		this.builder.setEntryPoint(entryPoint);
	}

	async rebuildProject(): Promise<void> {
		await this.builder.rebuildProject();
	}

	addFile(filePath: string, content: string): void {
		this.builder.addFile(filePath, content);
	}

	addWorkspace(workspace: WorkspaceType): void {
		const files = this.getAllFiles(workspace)
		files.forEach((file) => {
			this.builder.addFile(file.path, file.content);
		});
	}

	private getAllFiles(workspace: WorkspaceType): IFile[] {
		const files: IFile[] = []
	
		function traverse(item: WorkspaceItem) {
			if ("children" in item) {
				item.children?.forEach(traverse)
			} else if (item.content !== undefined) {
				files.push({
					...item,
					path: "." + item.path,
				})
			}
		}
	
		workspace.forEach(traverse)
	
		return files
	}
}