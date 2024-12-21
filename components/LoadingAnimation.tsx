export default function LoadingAnimation() {
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <div className="h-full bg-gradient-to-r from-indigo-600 via-pink-500 to-purple-600 animate-loading-bar" />
    </div>
  );
}
