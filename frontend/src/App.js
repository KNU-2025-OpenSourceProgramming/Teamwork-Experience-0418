import React, { useState } from 'react';
import './App.css';

/**
 * 音频转写应用的主组件
 * 实现录音和显示转写结果的功能
 */
function App() {
  // 录音状态管理
  const [isRecording, setIsRecording] = useState(false);
  // 转写结果数组管理
  const [transcriptions, setTranscriptions] = useState([]);

  /**
   * 处理开始录音的事件
   * 设置录音状态为true并开始录音
   */
  const handleStartRecording = () => {
    setIsRecording(true);
    // TODO: 实现录音开始逻辑
  };

  /**
   * 处理停止录音的事件
   * 设置录音状态为false并停止录音
   */
  const handleStopRecording = () => {
    setIsRecording(false);
    // TODO: 实现录音停止逻辑
  };

  return (
    <div className="App">
      <main className="App-main">
        {/* 录音控制按钮区域 */}
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
        {/* 转写结果显示区域 */}
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