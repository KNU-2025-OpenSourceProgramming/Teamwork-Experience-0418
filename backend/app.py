from flask import Flask, render_template
from flask_cors import CORS
from flask_sock import Sock

app = Flask(__name__,
    template_folder='./www',
    static_folder='./www',
    static_url_path='/'
)
CORS(app)
sock = Sock(app)

@app.route('/')
def index():
    return render_template('index.html')

@sock.route('/audio')
def handle_audio(ws):
    while True:
        data = ws.receive()
        if data is None:
            break
        
        # 초기 버전에서는 단순히 메시지 반환
        ws.send("음성 인식 결과가 여기에 표시됩니다...")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)