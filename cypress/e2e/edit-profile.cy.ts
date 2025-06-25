/// <reference types="cypress" />

describe('E2E Edit Profile Flow', () => {
  it('should login and successfully update profile data', () => {
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

    cy.contains('Edit profile').click();
    cy.get('.modal').should('exist');

    cy.get('#first-name-input').clear().type('Ionel');
    cy.get('#last-name-input').clear().type('Popescu');
    cy.get('#username-input').clear().type(`user${Math.floor(Math.random() * 10000)}`);

    cy.get('select#theme-modal-select').select('theme-dark');

    cy.get('input[type="file"]#fileInput').selectFile('cypress/fixtures/test-avatar.png', { force: true });

    cy.contains('Save Changes').click();

    cy.get('.modal').should('not.exist');
    cy.contains('Ionel').should('exist');
    cy.contains('Popescu').should('exist');
    cy.get('body').should('have.class', 'theme-dark');

     cy.get('.profile-pic')
      .should('have.attr', 'src')
      .and('not.include', 'default-avatar.png');
  });
});
