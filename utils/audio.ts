let audioContext: AudioContext
let analyser: AnalyserNode
let dataArray: Uint8Array

export async function setupAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)()
  analyser = audioContext.createAnalyser()
  analyser.fftSize = 256
  dataArray = new Uint8Array(analyser.frequencyBinCount)

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const source = audioContext.createMediaStreamSource(stream)
    source.connect(analyser)
  } catch (err) {
    console.error('マイクの取得に失敗:', err)
    throw err
  }
}

export function getDBLevel() {
  analyser.getByteFrequencyData(dataArray)
  const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
  const db = Math.round((average * 20) / 255)
  return db
}

