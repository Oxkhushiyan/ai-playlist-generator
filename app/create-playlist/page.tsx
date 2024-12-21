'use client';

import { useState, useRef, useEffect } from 'react';
import { FaCamera, FaSpotify } from 'react-icons/fa';
import { analyzeEmotions } from '../../utils/gemini';
import { createEmotionBasedPlaylist } from '../../utils/spotify';
import { signIn, useSession } from 'next-auth/react';
import LoadingAnimation from '../../components/LoadingAnimation';

interface EmotionData {
  Anger: number;
  Anxiety: number;
  Awe: number;
  Bored: number;
  Calm: number;
  Confusion: number;
  Disgust: number;
  Excitement: number;
  Fear: number;
  Horror: number;
  Joy: number;
  Nostalgia: number;
  Relief: number;
  Sad: number;
  Satisfaction: number;
  Surprise: number;
}

export default function CreatePlaylist() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [emotionData, setEmotionData] = useState<EmotionData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const { data: session } = useSession();
  const playlistSectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const captureImages = async () => {
    try {
      // Reset previous results
      setEmotionData(null);
      setPlaylistUrl('');
      
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Wait for video to be ready
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const images: string[] = [];
      for (let i = 0; i < 3; i++) {
        if (videoRef.current && canvasRef.current) {
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
          const ctx = canvasRef.current.getContext('2d');
          ctx?.drawImage(videoRef.current, 0, 0);
          const imageData = canvasRef.current.toDataURL('image/jpeg');
          images.push(imageData);
          await new Promise((resolve) => setTimeout(resolve, 500)); // Wait between captures
        }
      }

      // Stop the camera
      stream.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsCapturing(false);
      setIsProcessing(true);

      try {
        // Send images to Gemini API for analysis
        const emotionResults = await analyzeEmotions(images);
        setEmotionData(emotionResults);
      } catch (error) {
        console.error('Error analyzing emotions:', error);
        alert('Failed to analyze emotions. Please try again.');
      } finally {
        setIsProcessing(false);
      }

    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsCapturing(false);
      setIsProcessing(false);
    }
  };

  const emotionColors: { [key: string]: string } = {
    Joy: 'bg-yellow-500',
    Excitement: 'bg-red-500',
    Satisfaction: 'bg-green-500',
    Calm: 'bg-blue-400',
    Awe: 'bg-purple-500',
    Nostalgia: 'bg-amber-500',
    Relief: 'bg-teal-500',
    Surprise: 'bg-pink-500',
    Anxiety: 'bg-indigo-500',
    Fear: 'bg-slate-600',
    Anger: 'bg-red-600',
    Sad: 'bg-blue-600',
    Horror: 'bg-gray-800',
    Confusion: 'bg-violet-500',
    Disgust: 'bg-emerald-600',
    Bored: 'bg-orange-500'
  };

  // Auto-scroll effect when playlist is generated
  useEffect(() => {
    if (playlistUrl && playlistSectionRef.current) {
      playlistSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [playlistUrl]);

  return (
    <main className="min-h-screen bg-white">
      {/* Loading bar */}
      {(isCapturing || isProcessing || isGenerating) && <LoadingAnimation />}
      
      {/* Header with gradient background */}
      <div className="w-full bg-gradient-to-r from-indigo-600 via-pink-500 to-purple-600 h-2" />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hidden video and canvas elements */}
        <video ref={videoRef} style={{ display: 'none' }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Emotion Capture Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            Capture Your Mood
          </h2>
          <div className="bg-gray-50 rounded-lg p-6 shadow-lg">
            <div className="text-center">
              <p className="text-lg mb-6 text-gray-700">
                Click the button below to capture your mood through facial expressions
              </p>
              
              <div className="flex justify-center mb-4">
                <button
                  onClick={captureImages}
                  disabled={isCapturing || isProcessing}
                  className={`flex items-center gap-2 px-6 py-3 ${
                    isCapturing || isProcessing
                      ? 'bg-gray-400'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  } text-white rounded-full transition-colors`}
                >
                  <FaCamera />
                  {isCapturing ? 'Capturing...' : isProcessing ? 'Processing...' : 'Capture Mood'}
                </button>
              </div>
              
              {isProcessing && (
                <div className="mt-4 text-gray-600">
                  Detecting emotions<span className="loading-dots"></span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Emotion Analysis Section */}
        {emotionData && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Emotion Analysis
            </h2>
            <div className="bg-gray-50 rounded-lg p-6 shadow-lg">
              <div className="w-full">
                {Object.entries(emotionData)
                  .filter(([_, value]) => value > 0) // Filter out emotions with 0%
                  .sort((a, b) => b[1] - a[1])
                  .map(([emotion, value]) => (
                    <div key={emotion} className="mb-4">
                      <div className="flex items-center mb-1">
                        <span className="w-24 text-gray-700 capitalize">{emotion}</span>
                        <span className="ml-auto text-gray-600">{Math.round(value * 100)}%</span>
                      </div>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full emotion-bar ${emotionColors[emotion]}`}
                          style={{ '--target-width': `${value * 100}%` } as { [key: string]: string }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* Generate Playlist Section */}
        <section className="mb-12">
          <div className="flex justify-center">
            <button
              onClick={async () => {
                if (!session) {
                  signIn('spotify');
                  return;
                }

                if (!emotionData) {
                  alert('Please capture your mood first!');
                  return;
                }

                setIsGenerating(true);
                try {
                  const result = await createEmotionBasedPlaylist(
                    session.accessToken as string,
                    emotionData
                  );
                  setPlaylistUrl(result.playlistUrl);
                } catch (error) {
                  console.error('Error creating playlist:', error);
                  alert('Failed to create playlist. Please try again.');
                } finally {
                  setIsGenerating(false);
                }
              }}
              disabled={isGenerating || !emotionData}
              className={`flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold
                ${emotionData ? 'bg-gradient-to-r from-indigo-600 via-pink-500 to-purple-600 hover:opacity-90' : 'bg-gray-300'}
                transition-all duration-300`}
            >
              {isGenerating ? (
                <div className="loading-spinner w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <FaSpotify className="text-xl" />
                  Generate Your Playlist
                </>
              )}
            </button>
          </div>
        </section>

        {/* Playlist Link Section */}
        {playlistUrl && (
          <section ref={playlistSectionRef} className="mb-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Your Playlist is Ready!
              </h3>
              <a
                href={playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1DB954] text-white rounded-full hover:bg-[#1ed760] transition-colors"
              >
                <FaSpotify className="text-xl" />
                Open in Spotify
              </a>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
