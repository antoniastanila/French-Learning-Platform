import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  standalone: true,
  styleUrls: ['./user-profile.component.css'],
  imports: [CommonModule]
})
export class UserProfileComponent implements OnInit {
  username: string | null = null;
  email: string | null = null;
  profilePicUrl: string = '';
  originalProfilePicUrl: string = '';
  editingProfilePic: boolean = false;
  tempProfilePic: string = '';
  userId: string | null = null;
  firstName: string | null = null;
  lastName: string | null = null;
  createdAt: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.email = localStorage.getItem('email');
    this.userId = localStorage.getItem('userId');
    this.firstName = localStorage.getItem('firstName');
    this.lastName = localStorage.getItem('lastName');
    this.createdAt = localStorage.getItem('createdAt');
    console.log('📅 LocalStorage createdAt:', this.createdAt);

    const storedPic = localStorage.getItem('profilePicUrl');
    this.profilePicUrl = storedPic && storedPic.trim() !== ''
      ? storedPic
      : 'assets/images/default-avatar.jpg';

    this.originalProfilePicUrl = this.profilePicUrl;
  }

  startEditing(): void {
    this.editingProfilePic = true;
    this.tempProfilePic = this.profilePicUrl;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          this.tempProfilePic = reader.result;
        }
      };

      reader.readAsDataURL(file);
    }
  }

  cancelEditing(): void {
    this.editingProfilePic = false;
    this.tempProfilePic = this.originalProfilePicUrl;
  }

  saveProfilePic(): void {
    this.editingProfilePic = false;
  
    const input = document.getElementById('fileInput') as HTMLInputElement;
  
    if (this.userId && input?.files && input.files[0]) {
      const formData = new FormData();
      formData.append('image', input.files[0]);
  
      this.http.patch<{ imageUrl: string }>(
        `https://localhost:5000/api/users/${this.userId}/upload-profile-pic`,
        formData
      ).subscribe({
        next: (res) => {
          this.profilePicUrl = res.imageUrl;
          localStorage.setItem('profilePicUrl', this.profilePicUrl);
          console.log('✅ Imaginea a fost încărcată.');
        },
        error: (err) => {
          console.error('❌ Eroare la upload:', err);
          this.cancelEditing();
        }
      });
    }
  }
  
}
