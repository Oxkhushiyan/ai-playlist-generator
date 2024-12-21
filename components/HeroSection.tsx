import { FaMusic, FaHeadphones, FaCompactDisc, FaMicrophoneAlt } from 'react-icons/fa';
import AnimatedButton from './AnimatedButton';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-100 relative">
      {/* Icons Background */}
      <div className="absolute inset-0 overflow-hidden opacity-50">
        <div className="icon-container absolute top-[15%] left-[20%] p-4 beat-icon">
          <FaMusic className="text-3xl text-purple-700" />
        </div>
        <div className="icon-container absolute top-[20%] right-[15%] p-4 beat-icon animation-delay-200">
          <FaHeadphones className="text-3xl text-pink-600" />
        </div>
        <div className="icon-container absolute bottom-[25%] left-[20%] p-4 beat-icon animation-delay-300">
          <FaCompactDisc className="text-3xl text-blue-600" />
        </div>
        <div className="icon-container absolute bottom-[20%] right-[20%] p-4 beat-icon animation-delay-150">
          <FaMicrophoneAlt className="text-3xl text-indigo-600" />
        </div>
      </div>
      
      {/* Content */}
      <h1 className="text-4xl md:text-7xl mb-4 space-y-2 z-10 title-font">
        <div className="overflow-hidden">
          <span className="inline-block transform hover:scale-105 transition-all duration-700 ease-out blur-in-text">
            EMOTION-DRIVEN
          </span>
        </div>
        <div className="overflow-hidden">
          <span className="inline-block transform hover:scale-105 transition-all duration-700 ease-out blur-in-text animation-delay-300">
            AI MUSIC RECOMMENDER
          </span>
        </div>
      </h1>
      <p className="font-sans text-xl md:text-3xl mb-8 text-gray-700 font-semibold max-w-2xl animate-fade-in delay-700 hover:text-indigo-600 transition-colors duration-500 tracking-wide">
        PERSONALIZED PLAYLISTS FOR EVERY MOOD
      </p>
      <div className="animate-fade-in delay-700">
        <div className="flex justify-center gap-4 z-10">
          <Link href="/create-playlist">
            <AnimatedButton>
              <span className="relative z-10 tracking-wide">Create Playlist</span>
            </AnimatedButton>
          </Link>
        </div>
      </div>
    </div>
  );
}