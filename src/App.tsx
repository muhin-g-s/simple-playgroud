import { EditorComponent } from './editor'
import { PreviewComponent } from './preview'
import { CardComponent } from './shared'
import { WorkspaceComponent } from './workspace'

import styles from './App.module.css';
import { useFileSystem } from './file-systen';
import { useEsBuild } from './preview/hooks/use-esbuild';
import { useCallback, useEffect } from 'react';

function App() {
	const { workspace, currentFile, handleFileSelect, handleFileContentChange, loading: fsLoading } = useFileSystem()
  const { triggerBuild, addFiles, setEntryPoint } = useEsBuild()

  useEffect(() => {
		async function addFilesToEsService() {
			if (workspace.length > 0) {
				const entryPoint = './main.tsx';
				setEntryPoint(entryPoint)

				addFiles(workspace)
				await triggerBuild()
			}	
		}

		addFilesToEsService();
  }, [workspace, addFiles, setEntryPoint, triggerBuild])

  const handleFileContentChangeAndBuild = useCallback(
    async (content: string) => {
      handleFileContentChange(content)
      await triggerBuild()
    },
    [handleFileContentChange, triggerBuild],
  )

  if (fsLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <CardComponent>
        <WorkspaceComponent workspace={workspace} onFileSelect={handleFileSelect} />
      </CardComponent>
      <CardComponent>
        <EditorComponent file={currentFile} onContentChange={handleFileContentChangeAndBuild} />
      </CardComponent>
      <CardComponent>
        <PreviewComponent />
      </CardComponent>
    </div>
  )
}

export default App
