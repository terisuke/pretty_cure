'use client'

import { useState, useEffect, useRef } from 'react'
import { setupAudio, getDBLevel } from '../utils/audio'

interface GameScreenProps {
  onEnd: (volume: number) => void
}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export default function GameScreen({ onEnd }: GameScreenProps) {
  const [message, setMessage] = useState('')
  const [currentVolume, setCurrentVolume] = useState(0)
  const [maxVolume, setMaxVolume] = useState(0)
  const [lastDetectedPhrase, setLastDetectedPhrase] = useState('')
  const [debug, setDebug] = useState({ hasPhrase: false, hasVolume: false })
  const maxVolumeRef = useRef(0)

  useEffect(() => {
    let recognition: SpeechRecognition | null = null
    let isGameRunning = true

    const startRecognition = async () => {
      await setupAudio()
      recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'ja-JP'

      recognition.onresult = (event) => {
        if (!isGameRunning) return

        const db = getDBLevel()
        let transcript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript = event.results[i][0].transcript
            setLastDetectedPhrase(transcript)
          }
        }

        setCurrentVolume(db)
        maxVolumeRef.current = Math.max(maxVolumeRef.current, db)
        setMaxVolume(maxVolumeRef.current)

        const hasPhrase = transcript.includes('頑張れ')
        const hasVolume = maxVolumeRef.current >= 3

        setDebug({ hasPhrase, hasVolume })

        if (hasPhrase && hasVolume) {
          console.log('クリア条件達成！', { transcript, maxVolume: maxVolumeRef.current })
          onEnd(maxVolumeRef.current)
          isGameRunning = false
        } else if (hasPhrase) {
          setMessage('もう少し大きい声で！')
        } else if (hasVolume) {
          setMessage('頑張れと言ってね！')
        } else {
          setMessage('')
        }
      }

      recognition.onerror = (event) => {
        console.error('音声認識エラー:', event.error)
        setMessage('音声認識エラーが発生しました。')
      }

      recognition.start()
    }

    startRecognition()

    return () => {
      isGameRunning = false
      if (recognition) {
        recognition.stop()
      }
    }
  }, [onEnd])

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">「頑張れ」と言ってください！</h2>
      <p className="text-xl mb-2">{message}</p>
      <p>現在の音量: <span className="font-bold">{currentVolume}</span> dB</p>
      <p>最大音量: <span className="font-bold">{maxVolume}</span> dB</p>
      <p className="mt-4">最後に検知した語句: <span className="font-bold">{lastDetectedPhrase}</span></p>
      <div className="mt-4 text-sm text-gray-500">
        <p>フレーズ検知: {debug.hasPhrase ? '✅' : '❌'}</p>
        <p>音量条件 (3dB以上): {debug.hasVolume ? '✅' : '❌'}</p>
      </div>
    </div>
  )
}

