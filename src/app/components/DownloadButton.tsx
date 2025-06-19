import DownloadIcon from "./icons/DownloadIcon";
interface DownloadButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export default function DownloadButton({
  onClick,
  disabled,
  loading,
}: DownloadButtonProps) {
  return (
    <button
      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 px-8 rounded-lg mb-8 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={disabled}
    >
      <DownloadIcon />
      {loading ? "Creating Archive..." : "Download Compressed Archive"}
    </button>
  );
}
