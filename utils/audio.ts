let audioContext: AudioContext
let analyser: AnalyserNode
let dataArray: Uint8Array
  // Start of Selection

// オーディオコンテキストとアナライザーをセットアップする関数
export async function setupAudio() {
  // 新しいオーディオコンテキストを作成
  audioContext = new (window.AudioContext)()
  // アナライザーを作成し、FFTサイズを設定
  analyser = audioContext.createAnalyser()
  analyser.fftSize = 512
  // 周波数データを格納するための配列を作成
  dataArray = new Uint8Array(analyser.frequencyBinCount)

  try {
    // ユーザーのマイク入力を取得
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    // マイク入力をオーディオコンテキストのソースとして設定
    const source = audioContext.createMediaStreamSource(stream)
    // ソースをアナライザーに接続
    source.connect(analyser)
  } catch (err) {
    // マイクの取得に失敗した場合のエラーハンドリング
    console.error('マイクの取得に失敗:', err)
    throw err
  }
}

// デシベルレベルを取得する関数
export function getDBLevel() {
  // アナライザーから周波数データを取得
  analyser.getByteFrequencyData(dataArray)
  
  // データの一部をフィルタリング
  const filteredData = dataArray.slice(5, dataArray.length)

  // フィルタリングされたデータの平均値を計算
  const average = filteredData.reduce((sum, value) => sum + value, 0) / filteredData.length
  // 平均値をデシベルに変換
  const db = Math.round((average * 20) / 255)
  return db
}

