/// <reference types="cypress" />

describe('E2E Gemini Test Generation Flow', () => {
  it('should login and generate a test based on selected lessons', () => {
    cy.visit('https://localhost:4200/');
    cy.contains('Login').click();
    cy.url().should('include', '/login');
    cy.get('input[name="email"]').type('a@gmail.com');
    cy.get('input[name="password"]').type('111111');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/start-page');

    cy.window().then((win) => {
      const username = win.localStorage.getItem('username');
      expect(username).to.not.be.null;
      cy.get('button').contains(username!).click();
    });
    cy.url().should('include', '/profile');
    cy.contains('User profile').should('exist');

    cy.contains('Select lessons for the test').click();
    cy.get('.test-action-buttons').should('exist');

    cy.get('.card-lessons-scroll li.clickable-lesson').as('lessons');
    cy.get('@lessons').eq(0).click();
    cy.get('@lessons').eq(1).click();

    cy.contains('Generate test').click();

    cy.contains('Generating your test...').should('exist');

    cy.contains("Here's a test generated based on your chosen lessons", { timeout: 30000 }).should('exist');

    cy.get('pre').invoke('text').then((text) => {
      const questionCount = (text.match(/\d+\.\s/g) || []).length;
      expect(questionCount).to.be.greaterThan(4);
    });
    cy.contains("Here's a test generated based on your chosen lessons").should('exist');

  });
});
