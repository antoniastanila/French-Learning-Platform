import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LessonService } from '../../services/lesson.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-lesson-detail',
  standalone: true,
  templateUrl: './lesson-detail.component.html',
  styleUrls: ['./lesson-detail.component.css'],
  imports: [CommonModule]
})
export class LessonDetailComponent implements OnInit {
  lesson: any;

  constructor(private route: ActivatedRoute, private lessonService: LessonService) {}

  ngOnInit(): void {
    const lessonId = this.route.snapshot.paramMap.get('id');
    if (lessonId) {
      this.lessonService.getLessonById(lessonId).subscribe(data => {
        this.lesson = data;
      });
    }
  }
}
