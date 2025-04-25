import unittest
import os
import sys
import json
from unittest import mock
import io

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
    
    @mock.patch('whisper.load_model')
    def test_model_error_handling(self, mock_load_model):
        # Test error handling when model fails to load
        mock_load_model.side_effect = Exception("Test error")
        
        # Reimport to trigger the exception
        import importlib
        import app as app_module
        importlib.reload(app_module)
        
        # Check if the model is None when loading fails
        self.assertIsNone(app_module.model)
    
    @mock.patch('os.remove')
    @mock.patch('os.path.exists')
    def test_temp_file_cleanup(self, mock_exists, mock_remove):
        # Test that temporary files are cleaned up
        mock_exists.return_value = True
        
        # Mock the necessary functions to simulate the WebSocket route
        with mock.patch('app.model.transcribe') as mock_transcribe:
            mock_transcribe.return_value = {"text": "Test transcription"}
            
            # This is a simplified test as WebSocket testing is complex
            # In a real implementation, you would use a WebSocket client library
            
            # Verify that os.remove was called if the file exists
            mock_exists.assert_called_with('temp_audio.wav')
            mock_remove.assert_called_with('temp_audio.wav')

if __name__ == '__main__':
    unittest.main()