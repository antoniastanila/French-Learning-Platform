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
  level: string = 'beginner'; 

  constructor(private route: ActivatedRoute, private router: Router, private lessonService: LessonService, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
        this.lessonId = params['id'];
        this.level = params['level']; // 🔹 Preia nivelul direct din parametrii rutei

        const collection = this.level === 'intermediate' ? 'intermediate_lessons' : 'beginner_lessons';

        console.log(`Fetching lesson ${this.lessonId} from ${collection}`);

        // 🔹 Verifică dacă lessonId nu este null înainte de a face request-ul
        if (this.lessonId) {
            this.lessonService.getLessonById(this.lessonId, this.level).subscribe(lesson => {
                this.lesson = lesson;
            }, error => {
                console.error("Error fetching lesson:", error);
            });
        } else {
            console.warn("⚠️ Lesson ID is null, request not sent.");
        }
    });
}




  goToExercises() { 
    if (this.lessonId) {
      this.router.navigate([`/exercises/${this.lessonId}`]); 
    }
  }

  goToMainPage() {
    const userLevel = localStorage.getItem('level') || 'beginner'; 
    const mainPage = userLevel === 'intermediate' ? '/intermediate-main-page' : 
                     userLevel === 'advanced' ? '/advanced-main-page' :
                     '/beginner-main-page';
    this.router.navigate([mainPage]); // ✅ Redirecționează către pagina corespunzătoare nivelului
  }
  
  
}
