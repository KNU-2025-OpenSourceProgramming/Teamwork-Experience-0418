import unittest
import requests
import subprocess
import time
import os
import signal
import sys

class IntegrationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Start the backend server
        cls.backend_process = subprocess.Popen(
            ["python", "../backend/app.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            cwd=os.path.dirname(os.path.abspath(__file__))
        )
        
        # Give the server time to start
        time.sleep(5)
        
    @classmethod
    def tearDownClass(cls):
        # Terminate the backend server
        if sys.platform == 'win32':
            cls.backend_process.send_signal(signal.CTRL_C_EVENT)
        else:
            cls.backend_process.terminate()
        cls.backend_process.wait()
    
    def test_backend_is_running(self):
        # Test that the backend server is running and responding
        response = requests.get("http://localhost:3000/")
        self.assertEqual(response.status_code, 200)
    
    # Add more integration tests here

if __name__ == "__main__":
    unittest.main()