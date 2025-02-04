import { EditorComponent } from './editor'
import { PreviewComponent } from './preview'
import { CardComponent } from './shared'
import { WorkspaceComponent } from './workspace'

import styles from './App.module.css';
import { useFileSystem } from './file-systen';
import ESService from './preview/services';
import { useEffect } from 'react';

function App() {
	const { workspace, currentFile, handleFileSelect, handleFileContentChange, loading } = useFileSystem()

	useEffect(() => {
    if (currentFile?.content) {
      ESService.build(currentFile.content).catch((e) => {
        console.error("Build failed:", e);
      });
    }
  }, [currentFile?.content]);

	

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
