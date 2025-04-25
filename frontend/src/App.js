import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptions, setTranscriptions] = useState([]);
  const [status, setStatus] = useState('대기 중');
  const [isConnected, setIsConnected] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const socketRef = useRef(null);
  const audioChunksRef = useRef([]);
  const websocketUrl = 'ws://localhost:3000/audio';

  // WebSocket 연결 설정
  useEffect(() => {
    // 컴포넌트 마운트 시 WebSocket 연결
    connectWebSocket();

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const connectWebSocket = () => {
    try {
      socketRef.current = new WebSocket(websocketUrl);
      
      socketRef.current.onopen = () => {
        console.log('WebSocket 연결됨');
        setIsConnected(true);
        setStatus('서버에 연결됨');
      };
      
      socketRef.current.onmessage = (event) => {
        console.log('서버로부터 메시지 수신:', event.data);
        setTranscriptions(prev => [...prev, event.data]);
      };
      
      socketRef.current.onclose = () => {
        console.log('WebSocket 연결 종료');
        setIsConnected(false);
        setStatus('연결 끊김');
        
        // 자동 재연결 시도
        setTimeout(connectWebSocket, 3000);
      };
      
      socketRef.current.onerror = (error) => {
        console.error('WebSocket 오류:', error);
        setStatus('연결 오류');
      };
    } catch (error) {
      console.error('WebSocket 연결 실패:', error);
      setStatus('연결 실패');
    }
  };

  const handleStartRecording = async () => {
    try {
      // 마이크 접근 권한 요청
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // MediaRecorder 설정
      mediaRecorderRef.current = new MediaRecorder(streamRef.current);
      audioChunksRef.current = [];
      
      // 데이터 수집 이벤트 핸들러
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // 녹음 중지 이벤트 핸들러
      mediaRecorderRef.current.onstop = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          // 오디오 데이터를 Blob으로 변환
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          
          // ArrayBuffer로 변환하여 서버로 전송
          const reader = new FileReader();
          reader.onloadend = () => {
            socketRef.current.send(reader.result);
            setStatus('음성 데이터 전송 완료');
          };
          reader.readAsArrayBuffer(audioBlob);
        } else {
          setStatus('서버와 연결되지 않아 데이터를 전송할 수 없습니다');
        }
      };
      
      // 녹음 시작
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setStatus('녹음 중...');
    } catch (error) {
      console.error('녹음 시작 오류:', error);
      setStatus(`오류: ${error.message}`);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setStatus('녹음 중지, 처리 중...');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>음성 인식 애플리케이션</h1>
        <div className="status-indicator">
          상태: <span className={isConnected ? "connected" : "disconnected"}>{status}</span>
        </div>
      </header>
      <main>
        <div className="controls">
          <button 
            onClick={handleStartRecording} 
            disabled={isRecording || !isConnected}
            className={isRecording || !isConnected ? "button-disabled" : "button-primary"}
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
          {transcriptions.length === 0 ? (
            <p className="no-results">아직 인식된 결과가 없습니다. 녹음을 시작해보세요.</p>
          ) : (
            transcriptions.map((text, index) => (
              <div key={index} className="transcription-item">
                {text}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;