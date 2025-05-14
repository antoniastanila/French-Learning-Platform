import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-multiple-choice-question',
  standalone: true,
  templateUrl: './multiple-choice-question.component.html',
  styleUrls: ['./multiple-choice-question.component.css'],
  imports: [CommonModule]
})
export class MultipleChoiceQuestionComponent {
  @Input() question: string = '';
  @Input() options: string[] = [];
  @Input() correctAnswer: string = ''; 
  @Input() isAnswered: boolean = false;
  @Output() answerSelected = new EventEmitter<string>();
  
  selectedOption: string | null = null;

  selectAnswer(option: string) {
    if (!this.isAnswered) {
      this.selectedOption = option;
      this.answerSelected.emit(option);
    }
  }

  
}
