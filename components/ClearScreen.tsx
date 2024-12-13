import { Button } from '@/components/ui/button'

interface ClearScreenProps {
  volume: number
  onBack: () => void
}

export default function ClearScreen({ volume, onBack }: ClearScreenProps) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4">クリア！</h2>
      <p className="text-xl mb-4">検知された音量: <span className="font-bold">{volume}</span> dB</p>
      <p className="mb-4">深夜モードでクリアしました！</p>
      <Button onClick={onBack}>戻る</Button>
    </div>
  )
}

