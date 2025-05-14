import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fill-in-the-blank',
  standalone: true,
  templateUrl: './fill-in-the-blank.component.html',
  styleUrls: ['./fill-in-the-blank.component.css'],
  imports: [CommonModule, FormsModule]
})
export class FillInTheBlankComponent implements OnChanges{
  @Input() question: string = '';
  @Input() isAnswered: boolean = false;
  @Input() options: string[] = [];
  @Output() answerSelected = new EventEmitter<string>();

  userAnswer: string = '';

 ngOnChanges(changes: SimpleChanges) {
    if (changes['question']) {
      this.userAnswer = '';
    }
  }

  onInputChange() {
    if (!this.isAnswered) {
      this.answerSelected.emit(this.userAnswer.trim());
    }
  }
}
