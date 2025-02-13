import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-fill-in-the-blank',
  standalone: true,
  templateUrl: './fill-in-the-blank.component.html',
  styleUrls: ['./fill-in-the-blank.component.css'],
  imports: [CommonModule]
})
export class FillInTheBlankComponent {
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
