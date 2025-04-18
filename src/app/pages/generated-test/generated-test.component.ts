import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generated-test',
  standalone: true,
  templateUrl: './generated-test.component.html',
  styleUrls: ['./generated-test.component.css']
})
export class GeneratedTestComponent {
  testContent: string = '';
  
  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.testContent = navigation?.extras?.state?.['test'] || 'No test generated.';
  }
}
