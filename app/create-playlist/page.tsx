'use client';

import { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaStop, FaSpotify } from 'react-icons/fa';

const SAMPLE_SENTENCES = [
  "The sun is shining brightly today.",
  "I love spending time with my friends.",
  "Music always makes me feel better.",
  "Life is full of beautiful moments.",
  "The world is full of endless possibilities."
];

interface EmotionData {
  joy: number;
  sadness: number;
  anger: number;
  fear: number;
  surprise: number;
}

export default function CreatePlaylist() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [emotionData, setEmotionData] = useState<EmotionData | null>(null);
  const [playlistLink, setPlaylistLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const playlistSectionRef = useRef<HTMLDivElement>(null);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        audioChunks.current = [];
        
        setIsProcessing(true);
        // Simulate processing delay - change this value to adjust processing time (in milliseconds)
        await new Promise(resolve => setTimeout(resolve, 10000));
        setIsProcessing(false);
        
        // Simulate emotion data
        setEmotionData({
          joy: Math.random() * 0.8 + 0.2,
          sadness: Math.random() * 0.6,
          anger: Math.random() * 0.4,
          fear: Math.random() * 0.3,
          surprise: Math.random() * 0.5
        });
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  // Auto-scroll effect when playlist is generated
  useEffect(() => {
    if (playlistLink && playlistSectionRef.current) {
      playlistSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [playlistLink]);

  return (
    <main className="min-h-screen bg-white">
      {/* Header with gradient background */}
      <div className="w-full bg-gradient-to-r from-indigo-600 via-pink-500 to-purple-600 h-2" />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Audio Recording Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            Record Your Voice
          </h2>
          <div className="bg-gray-50 rounded-lg p-6 shadow-lg">
            <div className="text-center">
              <p className="text-lg mb-6 text-gray-700">
                Please read the following sentence:
              </p>
              <p className="text-xl font-medium mb-8 text-gray-900">
                "{SAMPLE_SENTENCES[Math.floor(Math.random() * SAMPLE_SENTENCES.length)]}"
              </p>
              
              <div className="flex justify-center mb-4">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                  >
                    <FaMicrophone />
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <FaStop />
                    Stop Recording
                  </button>
                )}
              </div>
              
              {isProcessing && (
                <div className="mt-4 text-gray-600">
                  Processing<span className="loading-dots"></span>
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
                  .sort((a, b) => b[1] - a[1])
                  .map(([emotion, value]) => (
                    <div key={emotion} className="mb-4">
                      <div className="flex items-center mb-1">
                        <span className="w-24 text-gray-700 capitalize">{emotion}</span>
                        <span className="ml-auto text-gray-600">{Math.round(value * 100)}%</span>
                      </div>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full emotion-bar ${
                            emotion === 'joy' ? 'bg-yellow-500' :
                            emotion === 'sadness' ? 'bg-blue-500' :
                            emotion === 'anger' ? 'bg-red-500' :
                            emotion === 'fear' ? 'bg-purple-500' :
                            'bg-green-500'
                          }`}
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
              onClick={() => {
                setIsGenerating(true);
                // Simulate playlist generation
                setTimeout(() => {
                  setIsGenerating(false);
                  setPlaylistLink('https://open.spotify.com/playlist/37i9dQZF1DX2czWA9hqErK');
                }, 10000);
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
        {playlistLink && (
          <section ref={playlistSectionRef} className="mb-12">
            <div className="bg-gray-50 rounded-lg p-6 shadow-lg text-center animate-fade-in">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Your Playlist is Ready!
              </h3>
              <a
                href={playlistLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
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
