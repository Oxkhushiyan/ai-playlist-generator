import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import TestIcons from '../components/TestIcons';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[rgb(23,23,23)] to-[rgb(38,38,38)] text-white overflow-hidden">
      <div className="relative">
        {/* Background gradient circles */}
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-purple-600/20 blur-[100px]" />
        <div className="absolute top-[30%] right-[-100px] w-[300px] h-[300px] rounded-full bg-pink-600/20 blur-[100px]" />
        <div className="absolute bottom-[-100px] left-[30%] w-[350px] h-[350px] rounded-full bg-blue-600/20 blur-[100px]" />
        
        {/* Content */}
        <Navigation />
        <HeroSection />
        <TestIcons />
      </div>
    </main>
  );
}
