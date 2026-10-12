export interface VoiceRecording {
  blob: Blob
  mime: string
  /** ثانیه */
  duration: number
}

/**
 * ضبط صدا با MediaRecorder.
 * start() → ضبط شروع می‌شه (اگه اجازه‌ی میکروفون نباشه خطا می‌ده)
 * stop()  → ضبط تموم می‌شه و فایل برمی‌گرده
 * cancel() → ضبط دور ریخته می‌شه
 * بعد از maxSeconds خودش متوقف می‌شه و onLimit صدا زده می‌شه.
 */
export function useVoiceRecorder(maxSeconds = 120, onLimit?: () => void) {
  const supported = import.meta.client
    && typeof MediaRecorder !== 'undefined'
    && !!navigator.mediaDevices?.getUserMedia

  const recording = ref(false)
  const seconds = ref(0)

  let recorder: MediaRecorder | null = null
  let stream: MediaStream | null = null
  let chunks: Blob[] = []
  let timer: ReturnType<typeof setInterval> | null = null
  let startedAt = 0
  let resolveStop: ((r: VoiceRecording | null) => void) | null = null

  function pickMime() {
    const list = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus']
    return list.find(m => MediaRecorder.isTypeSupported(m)) ?? ''
  }

  function cleanup() {
    if (timer) clearInterval(timer)
    timer = null
    stream?.getTracks().forEach(tr => tr.stop())
    stream = null
    recorder = null
    recording.value = false
  }

  async function start() {
    if (!supported || recording.value) return
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mime = pickMime()
    recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined)
    chunks = []
    recorder.ondataavailable = (e) => {
      if (e.data.size) chunks.push(e.data)
    }
    recorder.onstop = () => {
      const type = recorder?.mimeType || mime || 'audio/webm'
      const duration = (Date.now() - startedAt) / 1000
      const result = chunks.length ? { blob: new Blob(chunks, { type }), mime: type, duration } : null
      cleanup()
      resolveStop?.(result)
      resolveStop = null
    }
    startedAt = Date.now()
    seconds.value = 0
    recorder.start()
    recording.value = true
    timer = setInterval(() => {
      seconds.value = Math.floor((Date.now() - startedAt) / 1000)
      if (seconds.value >= maxSeconds) onLimit?.()
    }, 250)
  }

  function stop(): Promise<VoiceRecording | null> {
    if (!recorder || recorder.state === 'inactive') return Promise.resolve(null)
    return new Promise((resolve) => {
      resolveStop = resolve
      recorder!.stop()
    })
  }

  function cancel() {
    if (!recorder) return
    recorder.onstop = () => cleanup()
    if (recorder.state !== 'inactive') recorder.stop()
    else cleanup()
    resolveStop?.(null)
    resolveStop = null
  }

  onBeforeUnmount(cancel)

  return { supported, recording, seconds, start, stop, cancel }
}
