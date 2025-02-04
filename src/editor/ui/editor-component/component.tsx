import { IFile } from '../../../file-systen'

import styles from './styles.module.css'

interface IEditorProps {
  file: IFile | null
  onContentChange: (content: string) => void
}

export function EditorComponent({ file, onContentChange }: IEditorProps) {
  if (!file) {
    return <div className="p-4">No file selected</div>
  }

  return (
    <div className={styles.container}>
      <h2>{file.name}</h2>
      <textarea
        className={styles.editor}
        value={file.content}
        onChange={(e) => onContentChange(e.target.value)}
      />
    </div>
  )
}