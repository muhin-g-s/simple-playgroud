import { useCallback, useRef, useState } from 'react';
import { IFile, WorkspaceItem, WorkspaceType } from '../../file-systen';
import { createEsBuilder, IBuilder } from '../services';

function getAllFiles(workspace: WorkspaceType): IFile[] {
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

export interface BuildStatus {
  loading: boolean
  error: Error | null
}

export const useEsBuild = () => {
  const [status, setStatus] = useState<BuildStatus>({
    loading: false,
    error: null,
  })
  const esServiceRef = useRef<IBuilder | null>(null)

  const initializeESService = useCallback(() => {
    if (!esServiceRef.current) {
      esServiceRef.current = createEsBuilder();
    }
    return esServiceRef.current
  }, [])

  const addFiles = useCallback(
    (workspace: WorkspaceType) => {
      const esService = initializeESService()
      const files = getAllFiles(workspace)
      files.forEach((file) => {
        esService.addFile(file.path, file.content)
      })
    },
    [initializeESService],
  )

  const setEntryPoint = useCallback(
    (entryPoint: string) => {
      const esService = initializeESService()
			console.log("dddd", entryPoint);
      esService.setEntryPoint(entryPoint)
    },
    [initializeESService],
  )

  const triggerBuild = useCallback(async () => {
    const esService = initializeESService()
    setStatus((prev) => ({ ...prev, loading: true, error: null }))

    try {
      await esService.rebuildProject()
      setStatus({
        loading: false,
        error: null,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      setStatus({
        loading: false,
        error: new Error(message),
      })
      throw error
    }
  }, [initializeESService])

  return {
    addFiles,
    setEntryPoint,
    triggerBuild,
    ...status,
  }
}

