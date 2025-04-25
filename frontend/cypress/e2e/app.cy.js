describe('Voice Recognition App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/') // Adjust URL to match your dev server
  })

  it('displays the app title', () => {
    cy.contains('h1', '음성 인식 애플리케이션').should('be.visible')
  })

  it('has working recording buttons', () => {
    // Check initial button states
    cy.contains('button', '녹음 시작').should('not.be.disabled')
    cy.contains('button', '녹음 중지').should('be.disabled')
    
    // Click start recording
    cy.contains('button', '녹음 시작').click()
    
    // Check button states after starting
    cy.contains('button', '녹음 시작').should('be.disabled')
    cy.contains('button', '녹음 중지').should('not.be.disabled')
    
    // Check transcription appears
    cy.contains('녹음이 시작되었습니다.').should('be.visible')
    
    // Click stop recording
    cy.contains('button', '녹음 중지').click()
    
    // Check button states after stopping
    cy.contains('button', '녹음 시작').should('not.be.disabled')
    cy.contains('button', '녹음 중지').should('be.disabled')
    
    // Check transcription appears
    cy.contains('녹음이 중지되었습니다.').should('be.visible')
  })
})