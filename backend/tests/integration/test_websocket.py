import unittest
import os
import sys
import asyncio
import websockets
import json
import time
from threading import Thread

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app import app

class WebSocketIntegrationTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        
        cls.server_thread = Thread(target=lambda: app.run(host='0.0.0.0', port=5000))
        cls.server_thread.daemon = True
        cls.server_thread.start()
        time.sleep(1) 
    
    async def test_websocket_connection(self):
        ¸
        uri = "ws://localhost:5000/audio"
        async with websockets.connect(uri) as websocket:
            
            with open('tests/fixtures/test_audio.wav', 'rb') as f:
                audio_data = f.read()
            
            await websocket.send(audio_data)
            
            
            response = await websocket.recv()
            self.assertIsNotNone(response)
            self.assertIsInstance(response, str)
    
    def test_websocket_connection_sync(self):
        
        asyncio.get_event_loop().run_until_complete(self.test_websocket_connection())
