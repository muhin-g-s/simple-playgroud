import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { IFile, WorkspaceType } from '../entity';
import { IWorkspaceUseCase, createFileSystem } from '../initialize';

type State = {
  workspaceUseCase: IWorkspaceUseCase | null;
  currentFile: IFile | null;
  workspace: WorkspaceType;
  loading: boolean;
  error: Error | null;
};

type Action =
  | { type: 'SET_WORKSPACE_USE_CASE'; payload: IWorkspaceUseCase }
  | { type: 'SET_WORKSPACE'; payload: WorkspaceType }
  | { type: 'SET_CURRENT_FILE'; payload: IFile | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }
	| { type: 'UPDATE_WORKSPACE'; payload: WorkspaceType };

const initialState: State = {
  workspaceUseCase: null,
  currentFile: null,
  workspace: [],
  loading: true,
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_WORKSPACE_USE_CASE':
      return { ...state, workspaceUseCase: action.payload };
    case 'SET_WORKSPACE':
      return { ...state, workspace: action.payload };
    case 'SET_CURRENT_FILE':
      return { ...state, currentFile: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
		case 'UPDATE_WORKSPACE':
			return { ...state, workspace: action.payload };
    default:
      return state;
  }
}

export function useFileSystem() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        const newWorkspace = await createFileSystem();
        if (isMounted) {
          dispatch({ type: 'SET_WORKSPACE_USE_CASE', payload: newWorkspace });
          dispatch({ type: 'SET_WORKSPACE', payload: newWorkspace.getWorkspace() });
        }
      } catch (err) {
        if (isMounted) {
          dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err : new Error('Unknown error') });
        }
      } finally {
        if (isMounted) dispatch({ type: 'SET_LOADING', payload: false });
      }
    }

    init();
    return () => { isMounted = false };
  }, []);

  useEffect(() => {
    const updateCurrentFile = () => {
			if (!state.workspaceUseCase) return;

      const newFile = state.workspaceUseCase.getCurrentFile();
      dispatch({ type: 'SET_CURRENT_FILE', payload: newFile });
    };

    updateCurrentFile();
  }, [state.workspaceUseCase]);

	const handleFileSelect = useCallback((filePath: string) => {
    if (!state.workspaceUseCase) return;

    try {
      state.workspaceUseCase.setCurrentFile(filePath);
      const updatedFile = state.workspaceUseCase.getCurrentFile();
      dispatch({ type: 'SET_CURRENT_FILE', payload: updatedFile });
      dispatch({ type: 'UPDATE_WORKSPACE', payload: state.workspaceUseCase.getWorkspace() });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err : new Error('Failed to select file') });
    }
  }, [state.workspaceUseCase]);

  const handleFileContentChange = useCallback((content: string) => {
    if (!state.currentFile || !state.workspaceUseCase) return;

    try {
      state.workspaceUseCase.updateFileContent({
        path: state.currentFile.path,
        content: content,
      });

      const updatedFile = state.workspaceUseCase.getCurrentFile();
      if (!updatedFile) return;

      dispatch({ type: 'SET_CURRENT_FILE', payload: updatedFile });
      dispatch({ type: 'UPDATE_WORKSPACE', payload: state.workspaceUseCase.getWorkspace() });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err : new Error('Failed to update file') });
    }
  }, [state.workspaceUseCase, state.currentFile]);

  const api = useMemo(() => ({
    currentFile: state.currentFile,
    loading: state.loading,
    error: state.error,
    handleFileSelect,
    handleFileContentChange,
    workspace: state.workspace,
  }), [state.currentFile, state.loading, state.error, handleFileSelect, handleFileContentChange, state.workspace]);

  return api;
}