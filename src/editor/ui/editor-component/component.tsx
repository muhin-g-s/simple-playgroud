import { IFile } from '../../../file-systen'

interface IEditorProps {
  file: IFile | null
  onContentChange: (content: string) => void
}

export function EditorComponent({ file, onContentChange }: IEditorProps) {
  if (!file) {
    return <div className="p-4">No file selected</div>
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{file.name}</h2>
      <textarea
				// key={file.path}
        className="w-full h-[calc(100vh-8rem)] p-2 border rounded"
        value={file.content}
        onChange={(e) => onContentChange(e.target.value)}
      />
    </div>
  )
}