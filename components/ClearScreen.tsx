import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button'

interface ClearScreenProps {
  volume: number
  onBack: () => void
}

export default function ClearScreen({ volume, onBack }: ClearScreenProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('/audio/ふたりはプリキュア.mp3');
    audioRef.current = audio;
    audio.play();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const handleBack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onBack();
  };

  return (
    <div className="text-center">
      <Image
        src="/images/勝利.webp"
        alt="クリア！"
        width={500}
        height={500}
        className="w-1/2 mx-auto mb-4"
      />
      <h2 className="text-3xl font-bold mb-4">クリア！</h2>
      <p className="text-xl mb-4">検知された音量: <span className="font-bold">{volume}</span> dB</p>
      <p className="mb-4">深夜モードでクリアしました！</p>
      <Button onClick={handleBack}>戻る</Button>
    </div>
  )
}
