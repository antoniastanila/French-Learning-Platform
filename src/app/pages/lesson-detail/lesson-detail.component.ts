import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
  userId: string = '654321abc'; // Ar trebui să fie preluat din autentificare (hardcodat temporar)

  constructor(private route: ActivatedRoute, private router: Router, private lessonService: LessonService, private http: HttpClient) {}

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
  

  goToExercises() {
    if (this.lessonId) {
      this.router.navigate([`/exercises/${this.lessonId}`]); 
    }
  }

  goToMainPage() {
    this.router.navigate(['/main-page']); 
  }
  
}
