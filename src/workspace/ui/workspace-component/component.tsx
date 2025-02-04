import type { WorkspaceType,WorkspaceItem } from '../../../file-systen'

interface IWorkspaceComponentProps {
  workspace: WorkspaceType
  onFileSelect: (filePath: string) => void
}

export function WorkspaceComponent({ workspace, onFileSelect }: IWorkspaceComponentProps) {
  const renderItem = (item: WorkspaceItem) => {
    if ("children" in item) {
      return (
        <div key={item.path} className="ml-4">
          <div className="font-bold">{item.name}</div>
          {item.children.map(renderItem)}
        </div>
      )
    } else {
      return (
        <div key={item.path} className="ml-4 cursor-pointer hover:bg-gray-200" onClick={() => onFileSelect(item.path)}>
          {item.name}
        </div>
      )
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">File Explorer</h2>
      {workspace.map(renderItem)}
    </div>
  )
}