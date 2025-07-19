import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestService } from '../../services/test.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-generated-test',
  standalone: true,
  templateUrl: './generated-test.component.html',
  styleUrls: ['./generated-test.component.css'],
  imports: [CommonModule]
})
export class GeneratedTestComponent implements OnInit {
  testText: string = '';
  isLoading: boolean = true;

  constructor(private route: ActivatedRoute, private testService: TestService) {}

  ngOnInit() {
    const lessons = history.state?.lessons;
    console.log("📦 Lecții primite în componenta GeneratedTest:", lessons);

    if (lessons && lessons.length > 0) {
      this.testService.generateTest(lessons).subscribe({
        next: (res) => {
          this.testText = res.test;
          this.isLoading = false;
        },
        error: () => {
          this.testText = '❌ An error occurred while generating the test.';
          this.isLoading = false;
        }
      });
    } else {
      this.testText = '❌ No lessons provided.';
      this.isLoading = false;
    }
  }

  
}
