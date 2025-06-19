import FolderCompressor from "@/app/components/FolderCompressor";
import InstructionsSection from "@/app/components/InstructionsSection";

export default function Compressor() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-12 text-center">
        Directory Compressor
      </h1>
      <FolderCompressor />
      <InstructionsSection />
    </div>
  );
}
