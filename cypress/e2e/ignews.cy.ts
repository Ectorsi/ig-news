describe('empty spec', () => {
  it('Visit a local project', () => {
      cy.visit('http://localhost:3000/')
  })
  it('Should be able to find Sign in with Github button', () => {
    cy.contains(/Sign in with Github/i);
  })
  it('Should be able to click on the Sign in with Github button', () => {
    cy.contains(/Sign in with Github/i).click();
  })
})