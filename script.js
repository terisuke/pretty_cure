const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'ja-JP';

// 音声分析の設定
let audioContext;
let analyser;
let dataArray;
let source;

// DOM要素
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const clearScreen = document.getElementById('clear-screen');
const startButton = document.getElementById('start-button');
const backButton = document.getElementById('back-button');
const messageElement = document.getElementById('message');
const currentVolumeElement = document.getElementById('current-volume');
const clearVolumeElement = document.getElementById('clear-volume');

// 音声分析のセットアップ
async function setupAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
    } catch (err) {
        console.error('マイクの取得に失敗:', err);
        messageElement.textContent = 'マイクの取得に失敗しました。';
    }
}

// 音量をdBで取得する関数
function getDBLevel() {
    analyser.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    const db = Math.round(-100 + (average * 100 / 255));
    return db;
}

// ゲーム状態
let isGameRunning = false;

// ゲーム開始
function startGame() {
    setupAudio().then(() => {
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        isGameRunning = true;
        recognition.start();
        updateVolume();
    });
}

// ゲーム終了
function endGame(volume) {
    isGameRunning = false;
    recognition.stop();
    gameScreen.style.display = 'none';
    clearScreen.style.display = 'block';
    clearVolumeElement.textContent = volume;
}

// 音量更新
function updateVolume() {
    if (isGameRunning) {
        const db = getDBLevel();
        currentVolumeElement.textContent = db;
        requestAnimationFrame(updateVolume);
    }
}

// 音声認識結果のハンドリング
recognition.onresult = (event) => {
    if (!isGameRunning) return;

    const db = getDBLevel();
    let transcript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
            transcript = event.results[i][0].transcript;
        }
    }

    if (transcript.includes('がんばれ') && db >= 50) {
        endGame(db);
    } else if (transcript.includes('がんばれ')) {
        messageElement.textContent = 'もっと大きい声で！';
    } else if (db >= 50) {
        messageElement.textContent = 'がんばれと言ってね！';
    } else {
        messageElement.textContent = '';
    }
};

// エラーハンドリング
recognition.onerror = (event) => {
    console.error('音声認識エラー:', event.error);
    messageElement.textContent = '音声認識エラーが発生しました。';
};

// イベントリスナー
startButton.addEventListener('click', startGame);
backButton.addEventListener('click', () => {
    clearScreen.style.display = 'none';
    startScreen.style.display = 'block';
});

