import { EditorComponent } from './editor'
import { PreviewComponent } from './preview'
import { CardComponent } from './shared'
import { WorkspaceComponent } from './workspace'

import styles from './App.module.css';
import { useEditorPresenter } from './hooks';

function App() {
	const {workspace, loading, currentFile, handleChangeFile, handleFileContentChange} = useEditorPresenter();

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <CardComponent>
        <WorkspaceComponent workspace={workspace} onFileSelect={handleChangeFile} />
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
