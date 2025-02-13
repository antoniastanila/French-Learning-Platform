import { Component, OnInit } from '@angular/core';
import { LessonService } from '../../services/lesson.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lesson-list',
  standalone: true,
  templateUrl: './lesson-list.component.html',
  styleUrls: ['./lesson-list.component.css'],
  imports: [CommonModule, RouterModule]
})
export class LessonListComponent implements OnInit {
  lessons: any[] = [];

  constructor(private lessonService: LessonService) {}

  ngOnInit(): void {
    this.lessonService.getLessons().subscribe(data => {
      this.lessons = data;
    });
  }
}
