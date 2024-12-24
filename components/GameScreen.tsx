'use client'

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { getDBLevel, setupAudio } from '../utils/audio';
import LoseScreen from './LoseScreen';

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
  const [isGameRunning, setIsGameRunning] = useState(true)
  const [isTimeUp, setIsTimeUp] = useState(false)
  const maxVolumeRef = useRef(0)

  const audio1 = new Audio('/audio/前置き.wav');
  const audio2 = new Audio('/audio/頑張れ.wav');
  const audio3 = new Audio('/audio/大きな声で.wav');

  useEffect(() => {
    let recognition: SpeechRecognition | null = null
    let timer: NodeJS.Timeout

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
          setIsGameRunning(false)
          clearTimeout(timer)
        } else if (hasPhrase) {
          setMessage('もう少し大きい声で！')
          audio3.play();
        } else if (hasVolume) {
          setMessage('頑張れと言ってね！')
          audio2.play();
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

    audio1.onended = () => {
      startRecognition();
      timer = setTimeout(() => {
        setIsTimeUp(true)
        setIsGameRunning(false)
        if (recognition) {
          recognition.stop()
        }
      }, 40000);
    };

    audio1.play().catch((error) => {
      console.error('音声の再生に失敗しました:', error)
    });

    return () => {
      setIsGameRunning(false)
      clearTimeout(timer)
      if (recognition) {
        recognition.stop()
      }
    }
  }, [onEnd])

  if (isTimeUp) {
    return <LoseScreen onRetry={() => {
      setIsTimeUp(false)
      setIsGameRunning(true)
      maxVolumeRef.current = 0
      setMaxVolume(0)
      setCurrentVolume(0)
      setMessage('')
      audio1.play().catch((error) => {
        console.error('音声の再生に失敗しました:', error)
      });
    }} />
  }

  return (
    <div className="text-center">
      <Image
        src="/images/ピンチ.jpg"
        alt="ピンチだよ！"
        width={500}
        height={500}
        className="w-1/2 mx-auto mb-4"
      />
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

