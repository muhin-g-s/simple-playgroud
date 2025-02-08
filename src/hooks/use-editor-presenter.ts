import { useState, useEffect, useCallback } from 'react';
import { WorkspaceType, IFile } from '../file-systen';
import { IWorkspaceUseCase, getFileSystem } from '../file-systen/initialize';
import { getEsBuilder } from '../preview/services';

interface FileSystemStatus {
	loading: boolean;
	error: Error | null;
}

interface BuildStatus {
	loading: boolean
	error: Error | null
}

interface WorkspaceState {
	workspace: WorkspaceType
	workspaceUseCase: IWorkspaceUseCase | null
	currentFile: IFile | null
}

export function useEditorPresenter() {
	const [, setBuildStatus] = useState<BuildStatus>({
		loading: false,
		error: null,
	})

	const [fileSystemStatus, fileSystemSetStatus] = useState<FileSystemStatus>({
		loading: false,
		error: null,
	})

	const [workspaceState, setWorkspace] = useState<WorkspaceState>({
		workspace: [],
		workspaceUseCase: null,
		currentFile: null
	})

	useEffect(() => {
		let isMounted = true;
		
		async function loadFileSystem() {
			fileSystemSetStatus({ loading: true, error: null });

			try {
				const fileSystemUseCase = await getFileSystem();
				if (isMounted) {
					setWorkspace({
						workspace: fileSystemUseCase.getWorkspace(),
						workspaceUseCase: fileSystemUseCase,
						currentFile: null,
					});
					fileSystemSetStatus({ loading: false, error: null });
				}
			} catch (error) {
				if (isMounted) {
					const message = error instanceof Error ? error.message : "Unknown error";
					fileSystemSetStatus({
						loading: false,
						error: new Error(message),
					});
				}
			}
		}

		loadFileSystem();
		return () => { isMounted = false };
	}, []);

	useEffect(() => {
		const { workspace } = workspaceState;
		
		async function setupEsBuilder() {
			if (workspace.length === 0) return;

			const esService = getEsBuilder();
			esService.addWorkspace(workspace);
			esService.setEntryPoint('./main.tsx');
			
			try {
				setBuildStatus(prev => ({ ...prev, loading: true }));
				await esService.rebuildProject();
				setBuildStatus({ loading: false, error: null });
			} catch (error) {
				const message = error instanceof Error ? error.message : "Unknown error";
				setBuildStatus({ loading: false, error: new Error(message) });
			}
		}

		setupEsBuilder();
	}, [workspaceState]);

	const handleFileContentChange = useCallback(
		async (content: string) => {
			const { workspaceUseCase } = workspaceState;

			if(!workspaceUseCase) {
				return
			}

			workspaceUseCase.updateFileContent(content);

			const updatedWorkspace = workspaceUseCase.getWorkspace();

			setWorkspace((prev) => ({
				...prev,
				workspace: updatedWorkspace,
			}));
		},
		[workspaceState],
	)
	
	const handleChangeFile = useCallback(
		(filePath: string) => {
			const { workspaceUseCase } = workspaceState;

			if(!workspaceUseCase) {
				return
			}

			workspaceUseCase.setCurrentFile(filePath)

			setWorkspace((prev) => {
				return {
					...prev,
					currentFile: workspaceUseCase.getCurrentFile(),
				}
			})
		}, [workspaceState]
	)

	return {
		handleChangeFile,
		handleFileContentChange,
		currentFile: workspaceState.currentFile,
		workspace: workspaceState.workspace,
		...fileSystemStatus,
	}
}