import { useState } from "react";

export default function useVoice() {
  const [transcript, setTranscript] = useState("");

  async function uploadVoiceBlob(_blob) {
    // TODO: Implement backend upload + transcript fetch.
    setTranscript("");
  }

  return { transcript, uploadVoiceBlob };
}