import { useState } from "react";
import VoiceButton from "./ui/VoiceButton";

export default function VoiceDump() {
  const [lastNote, setLastNote] = useState("");

  const handleRecord = () => {
    setLastNote("Voice note saved. AI extraction will attach tasks and blockers here.");
  };

  return (
    <section className="panel voice-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Hands-free capture</p>
          <h2>Voice Dump</h2>
        </div>
        <VoiceButton onRecord={handleRecord} />
      </div>
      {lastNote ? (
        <p>{lastNote}</p>
      ) : (
        <div className="empty-state">
          <strong>No voice notes yet</strong>
          <p>Record a note to attach real blockers and tasks to your projects.</p>
        </div>
      )}
    </section>
  );
}
