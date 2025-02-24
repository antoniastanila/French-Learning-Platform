import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  username: string | null = null;
  email: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.email = localStorage.getItem('email'); 
  }
}
