import dynamic from 'next/dynamic';

const GameCanvas = dynamic(() => import('../components/GameCanvas'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-5xl font-bold mb-4">Dot Eater</h1>
      <p className="text-lg mb-8">Move your mouse to eat the dots and grow bigger!</p>
      <GameCanvas />
    </div>
  );
}