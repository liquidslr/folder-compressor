import { IGNORE_PATTERNS } from "@/app/utils/const";

export default function InstructionsSection() {
  return (
    <div className="bg-blue-50 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">How to use:</h2>
      <ol className="list-decimal list-inside space-y-2 text-blue-800">
        <li>Click "Select Directory" to choose a folder</li>
        <li>Review and select/deselect files in the tree view</li>
        <li>
          Click "Download Archive" to create and download the TAR.GZ archive
          (.tar.gz)
        </li>
        <li>
          Note: The following files are ignored which can be changed in the code
          <ol className="list-disc list-inside ml-5">
            {IGNORE_PATTERNS.map((pattern) => (
              <li key={pattern}>{pattern}</li>
            ))}
          </ol>
        </li>
      </ol>
    </div>
  );
}
