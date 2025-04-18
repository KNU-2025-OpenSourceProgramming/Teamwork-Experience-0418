import React, { useState } from 'react';
import './App.css';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptions, setTranscriptions] = useState([]);

  const handleStartRecording = () => {
    setIsRecording(true);
    // TODO: 实现录音开始逻辑
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // TODO: 实现录音停止逻辑
  };

  return (
    <div className="App">
      <main className="App-main">
        <div className="controls">
          <button
            onClick={handleStartRecording}
            disabled={isRecording}
            className={isRecording ? "button-disabled" : "button-primary"}
          >
            녹음 시작
          </button>
          <button
            onClick={handleStopRecording}
            disabled={!isRecording}
            className={!isRecording ? "button-disabled" : "button-secondary"}
          >
            녹음 중지
          </button>
        </div>
        <div className="transcriptions">
          <h2>인식 결과</h2>
          {transcriptions.map((text, index) => (
            <div key={index} className="transcription-item">
              {text}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App; 