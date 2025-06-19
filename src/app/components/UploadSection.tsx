import FolderIcon from "./icons/FolderIcon";

interface UploadSectionProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function UploadSection({ onUpload }: UploadSectionProps) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 mb-8 text-center">
      <div className="mb-6">
        <FolderIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-lg text-gray-600 mb-6">
          Choose a folder to convert to TAR.GZ
        </p>
        <label className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full cursor-pointer inline-block">
          Select Directory
          <input
            type="file"
            webkitdirectory="true"
            className="hidden"
            onChange={onUpload}
          />
        </label>
      </div>
    </div>
  );
}
