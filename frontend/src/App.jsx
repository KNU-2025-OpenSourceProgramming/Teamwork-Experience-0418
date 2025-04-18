import React, { useState } from 'react';
import './App.css';


function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptions, setTranscriptions] = useState([]);


  const handleStartRecording = () => {
    setIsRecording(true);
    setTranscriptions([...transcriptions, "녹음이 시작되었습니다."]);
  };


  const handleStopRecording = () => {
    setIsRecording(false);
    setTranscriptions([...transcriptions, "녹음이 중지되었습니다."]);
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>음성 인식 애플리케이션</h1>
      </header>
      <main>
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
