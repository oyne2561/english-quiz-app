/**
 * 音声合成ユーティリティ（Web Speech API）
 */

/**
 * 利用可能な音声を取得（iOS対応）
 */
function getVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  return window.speechSynthesis.getVoices();
}

/**
 * 指定された言語に最適な音声を取得
 */
function getBestVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = getVoices();
  
  if (voices.length === 0) {
    return null;
  }

  // 完全一致する音声を探す
  let voice = voices.find(v => v.lang === lang);
  
  // 完全一致がない場合、言語コードの前方一致で探す（例: en-US → en）
  if (!voice) {
    const langCode = lang.split('-')[0];
    voice = voices.find(v => v.lang.startsWith(langCode));
  }
  
  // それでもない場合、デフォルトの音声を使用
  if (!voice && voices.length > 0) {
    voice = voices.find(v => v.default) || voices[0];
  }
  
  return voice || null;
}

/**
 * テキストを音声で読み上げる
 */
export function speakText(text: string, lang: string = 'en-US', onEnd?: () => void): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis is not supported');
    return;
  }

  // 既存の読み上げを停止
  window.speechSynthesis.cancel();

  // iOS対応: 音声のロードを待つ
  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; // 少しゆっくりめ
    utterance.pitch = 1;
    utterance.volume = 1;

    // 最適な音声を設定
    const voice = getBestVoice(lang);
    if (voice) {
      utterance.voice = voice;
    }

    // 読み上げ終了時のイベント
    if (onEnd) {
      utterance.onend = () => {
        onEnd();
      };
      utterance.onerror = () => {
        onEnd();
      };
    }

    // iOS Safari対策: 少し待ってから再生
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 100);
  };

  // 音声リストが読み込まれているか確認
  const voices = getVoices();
  if (voices.length === 0) {
    // 音声リストのロードを待つ（iOS対応）
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        speak();
        window.speechSynthesis.onvoiceschanged = null;
      };
    } else {
      // onvoiceschangedがサポートされていない場合
      speak();
    }
  } else {
    speak();
  }
}

/**
 * 音声読み上げを停止
 */
export function stopSpeaking(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  window.speechSynthesis.cancel();
}

/**
 * 音声読み上げが利用可能かどうかを確認
 */
export function isSpeechSynthesisAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return 'speechSynthesis' in window;
}

