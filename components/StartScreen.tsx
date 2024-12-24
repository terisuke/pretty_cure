import Image from 'next/image';
import { Button } from '@/components/ui/button'

interface StartScreenProps {
  onStart: () => void
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="text-center">
      <Image
        src="/images/応援.jpeg"
        alt="プリキュアゲーム"
        width={500}
        height={500}
        className="w-1/2 mx-auto mb-4"
      />
      <p className="mb-4 text-lg">
        プリキュアがピンチだよ！
      </p>
      <p className="mb-4 text-lg">
        みんなで声を合わせて応援しよう！
      </p>
      <Button onClick={onStart}>
        スタート
      </Button>
    </div>
  )
}

