import { EditorComponent } from './editor'
import { PreviewComponent } from './preview'
import { CardComponent } from './shared'
import { WorkspaceComponent } from './workspace'

import styles from './App.module.css';

function App() {
  return (
   <div className={styles.container}>
	 	<CardComponent>
			<WorkspaceComponent />
		</CardComponent>
		<CardComponent>
			<EditorComponent />
		</CardComponent>
	 	<CardComponent>
			<PreviewComponent />
		</CardComponent>
	 </div>
  )
}

export default App
