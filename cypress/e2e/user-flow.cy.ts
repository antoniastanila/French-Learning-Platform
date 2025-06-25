/// <reference types="cypress" />

describe('E2E User Flow - Login → Lesson → Exercise', () => {
  it('should login, open a lesson and complete an exercise', () => {
    cy.visit('https://localhost:4200/');
    cy.contains('Login').click(); 
    cy.url().should('include', '/login'); 
    cy.get('input[name="email"]').type('a@gmail.com');
    cy.get('input[name="password"]').type('111111');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/start-page');
    cy.contains('Continue Learning').click();

    cy.url().should('match', /\/(beginner|intermediate|advanced)-main-page$/);
    cy.get('.lesson-card:not(.locked)').last().click();

    cy.get('h2').should('exist');

    cy.contains('Go to exercises').click();
    cy.url().should('include', '/exercises');

 function answerCurrentExercise(): void {
    cy.get('.correct-answer')
    .invoke('attr', 'data-correct-answer')
    .then((correctAnswer: string) => {
      cy.document().then((d) => {
        const doc = d as Document; 

        const radioInputs = doc.querySelectorAll('input[type="radio"]');
        const textInputs = doc.querySelectorAll('input[type="text"]');

        if (radioInputs.length > 0) {
          const labels = Array.from(doc.querySelectorAll('label'));
          for (const lbl of labels) {
            const label = lbl as HTMLLabelElement; 
            if (label.textContent?.trim() === correctAnswer.trim()) {
              const input = label.querySelector('input[type="radio"]') as HTMLInputElement | null;
              if (input) {
                cy.wrap(input).check({ force: true });
                break;
              }
            }
          }
        } else if (textInputs.length > 0) {
          cy.get('input[type="text"]').clear().type(correctAnswer);
        }

        cy.contains('Check').click();
        cy.get('.feedback-message').should('exist');

        cy.document().then((d2) => {
          const doc2 = d2 as Document;
          const buttons = Array.from(doc2.querySelectorAll('button'));
          const finishBtn = buttons.find((b) => {
            const btn = b as HTMLButtonElement;
            return btn.textContent?.includes('Finish lesson');
          });

          const isVisible = (el: Element | null): boolean =>
            !!el && !!(el as HTMLElement).offsetParent;

          if (isVisible(finishBtn || null)) {
            cy.wrap(finishBtn!).click();
            cy.get('h2').should('contain', 'Congratulations');
          } else {
            cy.contains('Next exercise').click();
            answerCurrentExercise();
          }
        });
      });
    });
}

    answerCurrentExercise();
  });
});
