import { useRef, useState } from "react";

export default function VoiceRecorder({
  onRecordingComplete,
}) {
  const [recording, setRecording] =
    useState(false);

  const mediaRecorderRef = useRef(null);

  const chunksRef = useRef([]);

  const startRecording = async () => {
    const stream =
      await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

    const recorder =
      new MediaRecorder(stream);

    chunksRef.current = [];

    recorder.ondataavailable = (event) => {
      chunksRef.current.push(event.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(
        chunksRef.current,
        {
          type: "audio/webm",
        }
      );

      const file = new File(
        [blob],
        "answer.webm",
        {
          type: "audio/webm",
        }
      );

      onRecordingComplete(file);
    };

    recorder.start();

    mediaRecorderRef.current = recorder;

    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div>
      {!recording ? (
        <button onClick={startRecording}>
          🎤 Start Recording
        </button>
      ) : (
        <button onClick={stopRecording}>
          ⏹ Stop Recording
        </button>
      )}
    </div>
  );
}