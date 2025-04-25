import unittest
import os
import sys
from unittest import mock

# 상위 디렉토리를 모듈 검색 경로에 추가
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app

class FlaskAppTests(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_home_status_code(self):
        # 홈 페이지 접속 테스트
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
    
    @mock.patch('whisper.load_model')
    def test_whisper_model_loading(self, mock_load_model):
        # Whisper 모델 로딩 테스트
        from app import model
        mock_load_model.assert_called_once_with("base")

if __name__ == '__main__':
    unittest.main()