from flask import Flask, render_template
from flask_cors import CORS
from flask_sock import Sock
import ssl
import io
import numpy as np
import torch
import whisper
import soundfile as sf
import os
import logging

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__,
    template_folder='./www',
    static_folder='./www',
    static_url_path='/'
)
CORS(app)
sock = Sock(app)

# Whisper 모델 로드
logger.info("Whisper 모델 로드 중...")
try:
    model = whisper.load_model("base")
    logger.info("Whisper 모델 로드 완료")
except Exception as e:
    logger.error(f"모델 로드 오류: {e}")
    model = None

@app.route('/')
def index():
    return render_template('index.html')

@sock.route('/audio')
def handle_audio(ws):
    logger.info("WebSocket 연결 성립")
    
    while True:
        try:
            # 클라이언트로부터 오디오 데이터 수신
            data = ws.receive()
            if data is None:
                logger.info("연결 종료")
                break
            
            logger.info("오디오 데이터 수신")
            
            # 바이너리 데이터를 BytesIO 객체로 변환
            audio_stream = io.BytesIO(data)
            audio_stream.seek(0)  # 스트림의 시작으로 이동
            
            # 임시 파일로 저장
            temp_file = 'temp_audio.wav'
            with open(temp_file, 'wb') as f:
                f.write(audio_stream.read())
            
            logger.info("임시 파일 저장 완료")
            
            # Whisper 모델로 음성 인식
            if model is not None:
                logger.info("음성 인식 시작")
                result = model.transcribe(temp_file)
                transcribed_text = result["text"]
                logger.info(f"인식 결과: {transcribed_text}")
                
                # 결과 전송
                ws.send(transcribed_text)
            else:
                logger.error("모델이 로드되지 않았습니다")
                ws.send("오류: 음성 인식 모델이 준비되지 않았습니다")
            
            # 임시 파일 삭제
            if os.path.exists(temp_file):
                os.remove(temp_file)
                
        except Exception as e:
            logger.error(f"오류 발생: {e}")
            ws.send(f"오류: {str(e)}")
    
    logger.info("WebSocket 연결 종료")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)