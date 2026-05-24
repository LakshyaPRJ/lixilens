import { useRef } from 'react';
import { Camera, Image } from 'lucide-react';

interface CameraSectionProps {
  onCameraClick: () => void;
  onUploadClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CameraSection({ onCameraClick, onUploadClick }: CameraSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="px-6 py-8">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <Camera className="w-10 h-10 text-indigo-600" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
          Capture or Upload Book Page
        </h2>

        <p className="text-gray-600 text-center leading-relaxed mb-8">
          Point your camera at any text or upload a clear photo of your page.
          Our scholar-ai will instantly extract and define complex vocabulary.
        </p>

        <div className="space-y-3">
          <button
            onClick={onCameraClick}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 text-white bg-indigo-600 rounded-full font-semibold hover:bg-indigo-700 transition-all hover:scale-105"
          >
            <Camera className="w-5 h-5" />
            Open Camera
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 text-indigo-600 bg-indigo-50 rounded-full font-semibold hover:bg-indigo-100 transition-all hover:scale-105"
          >
            <Image className="w-5 h-5" />
            Upload Image
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onUploadClick}
            className="hidden"
          />
        </div>
      </div>
    </section>
  );
}
