describe('녹음기능 테스트', () => {
  beforeEach(() => {
    cy.visit('/');
    
    // WebSocket 서버 Mock
    cy.window().then((win) => {
      win.WebSocket = class MockWebSocket {
        constructor(url) {
          this.url = url;
          this.readyState = WebSocket.OPEN;
          setTimeout(() => {
            if (this.onopen) this.onopen();
          }, 100);
        }
        
        send(data) {
          // 서버 응답 시뮬레이션
          setTimeout(() => {
            if (this.onmessage) {
              this.onmessage({ data: "음성 인식 테스트 결과입니다." });
            }
          }, 500);
        }
        
        close() {}
      };
      
      // WebSocket 상수 정의
      win.WebSocket.OPEN = 1;
    });
  });
  
  it('녹음 버튼이 표시되어야 함', () => {
    cy.contains('녹음 시작').should('be.visible');
    cy.contains('녹음 중지').should('be.visible');
  });
  
  it('녹음 시작 시 상태가 변경되어야 함', () => {
    // MediaRecorder Mock
    cy.window().then((win) => {
      win.MediaRecorder = class MockMediaRecorder {
        constructor() {
          this.state = 'inactive';
        }
        
        start() {
          this.state = 'recording';
          if (this.onstart) this.onstart();
        }
        
        stop() {
          this.state = 'inactive';
          if (this.onstop) this.onstop();
          if (this.ondataavailable) {
            this.ondataavailable({ data: new Blob() });
          }
        }
      };
      
      win.navigator.mediaDevices = {
        getUserMedia: () => Promise.resolve({
          getTracks: () => [{ stop: () => {} }]
        })
      };
    });
    
    cy.contains('녹음 시작').click();
    cy.contains('녹음 중...').should('be.visible');
    cy.contains('녹음 중지').click();
    cy.contains('처리 중...').should('be.visible');
    cy.contains('음성 인식 테스트 결과입니다.').should('be.visible');
  });
});
