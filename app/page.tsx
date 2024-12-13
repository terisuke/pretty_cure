'use client'

import { useState } from 'react'
import StartScreen from '../components/StartScreen'
import GameScreen from '../components/GameScreen'
import ClearScreen from '../components/ClearScreen'

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<'start' | 'game' | 'clear'>('start')
  const [clearVolume, setClearVolume] = useState(0)

  const startGame = () => setCurrentScreen('game')
  const endGame = (volume: number) => {
    setClearVolume(volume)
    setCurrentScreen('clear')
  }
  const backToStart = () => setCurrentScreen('start')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {currentScreen === 'start' && <StartScreen onStart={startGame} />}
      {currentScreen === 'game' && <GameScreen onEnd={endGame} />}
      {currentScreen === 'clear' && <ClearScreen volume={clearVolume} onBack={backToStart} />}
    </main>
  )
}

