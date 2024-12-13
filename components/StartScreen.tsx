import { Button } from '@/components/ui/button'

interface StartScreenProps {
  onStart: () => void
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">音声認識ゲーム</h1>
      <p className="mb-4 text-lg">3dB以上の音量で「頑張れ」と言ってください。(音量範囲: 0-20dB)</p>
      <Button onClick={onStart}>スタート</Button>
    </div>
  )
}

