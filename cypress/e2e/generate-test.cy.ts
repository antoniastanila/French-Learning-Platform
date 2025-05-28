/// <reference types="cypress" />

describe('E2E Gemini Test Generation Flow', () => {
  it('should login and generate a test based on selected lessons', () => {
    // 1. Login
    cy.visit('https://localhost:4200/');
    cy.contains('Login').click();
    cy.url().should('include', '/login');
    cy.get('input[name="email"]').type('a@gmail.com');
    cy.get('input[name="password"]').type('111111');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/start-page');

    // 2. Navigăm spre profil
    cy.window().then((win) => {
      const username = win.localStorage.getItem('username');
      expect(username).to.not.be.null;
      cy.get('button').contains(username!).click();
    });
    cy.url().should('include', '/profile');
    cy.contains('User profile').should('exist');

    // 3. Apasă pe "Select lessons for the test"
    cy.contains('Select lessons for the test').click();
    cy.get('.test-action-buttons').should('exist');

    // 4. Selectăm primele două lecții
    cy.get('.card-lessons-scroll li.clickable-lesson').as('lessons');
    cy.get('@lessons').eq(0).click();
    cy.get('@lessons').eq(1).click();

    // 5. Apasă pe "Generate test"
    cy.contains('Generate test').click();

    // 6. Verificăm că apare spinnerul de așteptare
    cy.contains('Generating your test...').should('exist');

    // 7. Așteptăm să se genereze testul (poate dura până la 30s)
    cy.contains("Here's a test generated based on your chosen lessons", { timeout: 30000 }).should('exist');

    // 8. Verificăm că testul conține cel puțin 5 întrebări
    cy.get('pre').invoke('text').then((text) => {
      const questionCount = (text.match(/\d+\.\s/g) || []).length;
      expect(questionCount).to.be.greaterThan(4);
    });
    cy.contains("Here's a test generated based on your chosen lessons").should('exist');

  });
});
