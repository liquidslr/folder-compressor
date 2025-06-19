import FolderIcon from "./icons/FolderIcon";
import FileIcon from "./icons/FileIcon";

type TreeViewProps = {
  tree: any;
  checked: Record<string, boolean>;
  onToggle: (path: string) => void;
  path?: string;
};

const TreeView: React.FC<TreeViewProps> = ({
  tree,
  checked,
  onToggle,
  path = "",
}) => {
  return (
    <ul className="ml-4">
      {Object.entries(tree).map(([name, value]: any) => {
        const fullPath = path ? `${path}/${name}` : name;
        const isFile = value instanceof File;
        return (
          <li key={fullPath} className="my-1">
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="checkbox"
                checked={checked[fullPath] ?? true}
                onChange={() => onToggle(fullPath)}
                className="rounded"
              />
              {isFile ? (
                <FileIcon className="w-4 h-4 text-blue-500" />
              ) : (
                <FolderIcon className="w-4 h-4 text-yellow-600" />
              )}
              <span className="text-sm">{name}</span>
            </label>
            {!isFile && (
              <TreeView
                tree={value}
                checked={checked}
                onToggle={onToggle}
                path={fullPath}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default TreeView;
