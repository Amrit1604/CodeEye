import { useRef, useState } from "react";

export default function VoiceButton({ onRecord }) {
  const [recording, setRecording] = useState(false);
  const [secs, setSecs] = useState(0);
  const timer = useRef(null);

  const toggle = () => {
    if (!recording) {
      setRecording(true);
      setSecs(0);
      timer.current = window.setInterval(() => setSecs((value) => value + 1), 1000);
      return;
    }

    setRecording(false);
    window.clearInterval(timer.current);
    onRecord?.();
  };

  return (
    <button
      className={`voice-button ${recording ? "is-recording" : ""}`}
      onClick={toggle}
      type="button"
    >
      <span />
      {recording ? `Recording ${secs}s - tap to stop` : "Voice dump"}
    </button>
  );
}
