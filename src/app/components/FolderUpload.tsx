type FolderUploadProps = {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const FolderUpload: React.FC<FolderUploadProps> = ({ onUpload }) => (
  <input
    type="file"
    // @ts-ignore
    webkitdirectory="true"
    // @ts-ignore
    directory="true"
    multiple
    className="mb-4"
    onChange={onUpload}
  />
);

export default FolderUpload;
