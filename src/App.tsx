import { EditorComponent } from './editor'
import { PreviewComponent } from './preview'
import { CardComponent } from './shared'
import { WorkspaceComponent } from './workspace'

import styles from './App.module.css';
import { useFileSystem } from './file-systen';
import { useEsBuild } from './preview/hooks/use-esbuild';
import { useBuildOnce } from './preview/hooks';

function App() {
	const { workspace, currentFile, handleFileSelect, handleFileContentChange, loading } = useFileSystem()
	const { triggerBuild } = useEsBuild();

	useBuildOnce(currentFile?.content, triggerBuild);
	
  if (loading) {
    return <div>loading...</div>
  }

  return (
    <div className={styles.container}>
      <CardComponent>
        <WorkspaceComponent workspace={workspace} onFileSelect={handleFileSelect} />
      </CardComponent>
      <CardComponent>
        <EditorComponent file={currentFile} onContentChange={handleFileContentChange} />
      </CardComponent>
      <CardComponent>
        <PreviewComponent />
      </CardComponent>
    </div>
  )
}

export default App
