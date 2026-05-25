import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CameraSection from './components/CameraSection';
import DailyScholar from './components/DailyScholar';
import RecentScan from './components/RecentScan';
import CuratedLexicons from './components/CuratedLexicons';
import Footer from './components/Footer';
import ConfirmCapture from './components/ConfirmCapture';
import AnalyzingPage from './components/AnalyzingPage';
import VocabularyResults from './components/VocabularyResults';
import { AnalysisResult } from './services/geminiService';

type Screen = 'home' | 'confirm' | 'analyzing' | 'results';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      const cameraModal = document.createElement('div');
      cameraModal.className = 'fixed inset-0 bg-black z-50 flex flex-col';
      cameraModal.innerHTML = `
        <div class="flex items-center justify-between px-6 py-4 bg-gray-900">
          <h2 class="text-white font-semibold">Take Photo</h2>
          <button class="text-white text-2xl font-bold">&times;</button>
        </div>
        <div class="flex-1 flex items-center justify-center relative overflow-hidden bg-black">
          <video id="cameraVideo" class="w-full h-full object-cover" autoplay playsinline muted></video>
        </div>
        <div class="flex gap-3 justify-center p-6 bg-gray-900">
          <button id="captureBtn" class="px-8 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700">
            Capture
          </button>
          <button id="cancelBtn" class="px-8 py-3 bg-gray-700 text-white rounded-full font-semibold hover:bg-gray-600">
            Cancel
          </button>
        </div>
      `;

      document.body.appendChild(cameraModal);
      const videoElement = cameraModal.querySelector('#cameraVideo') as HTMLVideoElement;
      videoElement.srcObject = stream;
      
      // Explicitly trigger play to ensure preview starts playing
      videoElement.play().catch(err => {
        console.error("Failed to play preview stream:", err);
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const captureBtn = cameraModal.querySelector('#captureBtn');
      const cancelBtn = cameraModal.querySelector('#cancelBtn');
      const closeBtn = cameraModal.querySelector('button:first-child');

      captureBtn?.addEventListener('click', () => {
        if (videoElement.videoWidth && videoElement.videoHeight) {
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
        } else {
          // Fallback if metadata is not fully populated
          canvas.width = 640;
          canvas.height = 480;
        }
        
        ctx!.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        stream.getTracks().forEach(track => track.stop());
        cameraModal.remove();
        setCurrentScreen('confirm');
      });

      const closeCamera = () => {
        stream.getTracks().forEach(track => track.stop());
        cameraModal.remove();
      };

      cancelBtn?.addEventListener('click', closeCamera);
      closeBtn?.addEventListener('click', closeCamera);
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Unable to access camera. Please check permissions and ensure no other app is using it.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
        setCurrentScreen('confirm');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGoHome = () => {
    setCapturedImage(null);
    setCurrentScreen('home');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <div className="min-h-screen bg-gray-50">
            <Header onNewScan={handleGoHome} />
            <main>
              <Hero />
              <CameraSection
                onCameraClick={handleCameraCapture}
                onUploadClick={handleImageUpload}
              />
              <DailyScholar />
              <RecentScan />
              <CuratedLexicons />
            </main>
            <Footer />
          </div>
        );
      case 'confirm':
        return <ConfirmCapture
          image={capturedImage}
          onCancel={handleGoHome}
          onAnalyze={() => setCurrentScreen('analyzing')}
        />;
      case 'analyzing':
        return <AnalyzingPage 
          image={capturedImage}
          onComplete={(result) => {
            setAnalysisResult(result);
            setCurrentScreen('results');
          }}
          onCancel={handleGoHome}
        />;
      case 'results':
        return <VocabularyResults 
          result={analysisResult}
          onNewScan={handleGoHome}
        />;
    }
  };

  return (
    <>
      {renderScreen()}
    </>
  );
}

export default App;
