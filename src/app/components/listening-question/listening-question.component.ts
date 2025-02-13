import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listening-question',
  standalone: true,
  templateUrl: './listening-question.component.html',
  styleUrls: ['./listening-question.component.css'],
  imports: [CommonModule]
})
export class ListeningQuestionComponent {
  @Input() audioUrl: string = '';  
  @Input() question: string = '';  
  @Input() options: string[] = [];  
  @Output() answerSelected = new EventEmitter<string>();  
  selectedOption: string | null = null;
  @Input() isAnswered: boolean = false; 

  selectAnswer(option: string) {
    if (!this.isAnswered) { 
      this.selectedOption = option; 
      this.answerSelected.emit(option);
    }
  }
}
