import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reading-comprehension',
  standalone: true,
  templateUrl: './reading-comprehension.component.html',
  styleUrls: ['./reading-comprehension.component.css'],
  imports: [CommonModule]
})
export class ReadingComprehensionComponent {
  @Input() passage: string = '';  
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
