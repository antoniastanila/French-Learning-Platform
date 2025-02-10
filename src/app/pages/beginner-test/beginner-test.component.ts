import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-beginner-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './beginner-test.component.html',
  styleUrls: ['./beginner-test.component.css']
})
export class BeginnerTestComponent {
  currentQuestionIndex = 0; // Indexul întrebării curente
  score = 0; // Scorul utilizatorului
  showResult = false; // Afișează rezultatul final

  // Întrebările și răspunsurile
  questions = [
    {
      question: 'What is the French word for "apple"?',
      options: ['Pomme', 'Orange', 'Banane', 'Poire'],
      correctAnswer: 'Pomme'
    },
    {
      question: 'How do you say "thank you" in French?',
      options: ['Merci', 'Bonjour', 'Au revoir', 'Salut'],
      correctAnswer: 'Merci'
    },
    {
      question: 'What is the French word for "goodbye"?',
      options: ['Au revoir', 'Bonjour', 'Salut', 'Merci'],
      correctAnswer: 'Au revoir'
    }
  ];

  // Metodă pentru a procesa răspunsul utilizatorului
  answerQuestion(selectedOption: string) {
    if (selectedOption === this.questions[this.currentQuestionIndex].correctAnswer) {
      this.score++;
    }

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.showResult = true;
    }
  }

  // Resetează testul
  resetQuiz() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.showResult = false;
  }
}
