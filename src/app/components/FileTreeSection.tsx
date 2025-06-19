import TreeView from "./TreeView";

interface FileTreeSectionProps {
  tree: any;
  checked: any;
  onToggle: (path: string) => void;
}

export default function FileTreeSection({
  tree,
  checked,
  onToggle,
}: FileTreeSectionProps) {
  if (!tree) return null;

  return (
    <div className="bg-white border rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Select Files and Folders</h2>
      <div className="max-h-96 overflow-y-auto">
        <TreeView tree={tree} checked={checked} onToggle={onToggle} />
      </div>
    </div>
  );
}
