import unittest
from app import app

class FlaskAppTests(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_home_status_code(self):
        # 홈 페이지 접속 테스트
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()