import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
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
  lessonId: string | null = null;
  lessonIds: string[] = [
    '67adff85ba1cb07465fad7fe', // Lesson 1
    '67ae296eba1cb07465fad800', // Lesson 2
    '67b30e72bf5bcc73adb8f797', // Lesson 3
    '67b30ed9bf5bcc73adb8f799', // Lesson 4
    '67b30efdbf5bcc73adb8f79b', // Lesson 5
    '67b30f0fbf5bcc73adb8f79d', // Lesson 6
    '67b30f28bf5bcc73adb8f79f', // Lesson 7
    '67b30f39bf5bcc73adb8f7a1', // Lesson 8
    '67b30f46bf5bcc73adb8f7a3', // Lesson 9
    '67b30f52bf5bcc73adb8f7a5', // Lesson 10
    '67b30f5fbf5bcc73adb8f7a7', // 11
    '67b30f6dbf5bcc73adb8f7a9'  // 12
  ];

  constructor(private route: ActivatedRoute, private router: Router, private lessonService: LessonService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.lessonId = params.get('id');
      if (this.lessonId) {
        this.lessonService.getLessonById(this.lessonId).subscribe(data => {
          this.lesson = data;
        });
      }
    });
  }


  goToNextLesson() {
    if (!this.lessonId) return;

    const currentIndex = this.lessonIds.indexOf(this.lessonId);
    if (currentIndex !== -1 && currentIndex < this.lessonIds.length - 1) {
      const nextLessonId = this.lessonIds[currentIndex + 1];
      this.router.navigate(['/lesson', nextLessonId]);
    }
  }
}
