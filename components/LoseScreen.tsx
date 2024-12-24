import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
interface LoseScreenProps {
  onRetry: () => void;
}

export default function LoseScreen({ onRetry }: LoseScreenProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('/audio/デデーン.mp3');
    audioRef.current = audio;
    audio.play();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const handleRetry = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onRetry();
  };

  
  
  return (
    <div className="text-center">
      <Image
        src="/images/敗北.webp"
        alt="敗北"
        width={500}
        height={500}
        className="w-1/2 mx-auto mb-4"
      />
      <h2 className="text-3xl font-bold mb-4">残念！</h2>
      <p className="text-xl mb-4">時間切れです。もう一度挑戦しましょう！</p>
      <Button onClick={handleRetry}>再挑戦</Button>
    </div>
  );
} 