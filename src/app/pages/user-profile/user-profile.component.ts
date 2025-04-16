import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LessonService } from '../../services/lesson.service';
import { Lesson } from '../../models/lesson.model'; 

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  standalone: true,
  styleUrls: ['./user-profile.component.css'],
  imports: [CommonModule, FormsModule]
})
export class UserProfileComponent implements OnInit {
  username: string | null = null;
  email: string | null = null;
  profilePicUrl: string = '';
  originalProfilePicUrl: string = '';
  tempProfilePic: string = '';
  userId: string | null = null;
  firstName: string | null = null;
  lastName: string | null = null;
  createdAt: string | null = null;

  showModal = false;
  tempFirstName: string | null = null;
  tempLastName: string | null = null;

  completedLessons: string[] = [];
  completedLessonsByLevel: { [key: string]: Lesson[] } = {
    beginner: [],
    intermediate: [],
    advanced: []
  };

  tempUsername: string | null = null;
  usernameError: string | null = null;

  selectMode = false;
  selectedLessons: Set<string> = new Set();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private lessonService: LessonService
  ) {}

  ngOnInit(): void {
    // 🌟 1. Actualizează datele utilizatorului
    this.authService.userProfile$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.setUserFields(user);
      } else {
        const fallbackUser = {
          _id: localStorage.getItem('userId'),
          username: localStorage.getItem('username'),
          email: localStorage.getItem('email'),
          firstName: localStorage.getItem('firstName'),
          lastName: localStorage.getItem('lastName'),
          createdAt: localStorage.getItem('createdAt'),
          profilePicUrl: localStorage.getItem('profilePicUrl') || 'assets/images/default-avatar.jpg',
        };
        this.setUserFields(fallbackUser);
        this.authService.updateUserProfile(fallbackUser);
      }
    });
  
    // 🌟 2. Încarcă progresul + ascultă după ce s-a actualizat
    this.authService.loadUserProgress();
  
    this.authService.completedLessons$.subscribe(ids => {
      this.completedLessons = ids;
  
      const levels = ['beginner', 'intermediate', 'advanced'];
      levels.forEach(level => {
        this.lessonService.getLessonsByLevel(level).subscribe((lessons: Lesson[]) => {
          const completed = lessons.filter(l => ids.includes(l._id));
          this.completedLessonsByLevel[level] = completed;
        });
      });
    });
  }
  
  private setUserFields(user: any): void {
    this.userId = user._id || localStorage.getItem('userId');
    this.username = user.username;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.createdAt = user.createdAt;
    this.profilePicUrl = user.profilePicUrl || 'assets/images/default-avatar.jpg';
  
    this.tempFirstName = this.firstName;
    this.tempLastName = this.lastName;
    this.tempProfilePic = this.profilePicUrl;
    this.tempUsername = this.username;
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

  openEditModal(): void {
    this.tempProfilePic = this.profilePicUrl;
    this.tempFirstName = this.firstName;
    this.tempLastName = this.lastName;
    this.tempUsername = this.username;
    this.usernameError = null;
    this.showModal = true;
  }
  
  closeModal(): void {
    this.showModal = false;
  }
  
  triggerFileInput(): void {
    const input = document.getElementById('fileInput') as HTMLInputElement;
    input?.click();
  }
  
  removeProfilePicture(): void {
    this.tempProfilePic = 'assets/images/default-avatar.jpg';
  }
  
  saveChanges(): void {
    if (!this.userId || this.usernameError) return;
  
    const updateData = {
      firstName: this.tempFirstName,
      lastName: this.tempLastName,
      username: this.tempUsername,
      profilePic: this.tempProfilePic === 'assets/images/default-avatar.jpg' ? '' : this.tempProfilePic,
    };
  
    this.http.patch(`https://localhost:5000/api/users/${this.userId}/update-profile`, updateData)
      .subscribe({
        next: (res: any) => {
          this.firstName = updateData.firstName;
          this.lastName = updateData.lastName;
          this.username = updateData.username!;
          this.profilePicUrl = updateData.profilePic || 'assets/images/default-avatar.jpg';
  
          localStorage.setItem('firstName', this.firstName || '');
          localStorage.setItem('lastName', this.lastName || '');
          localStorage.setItem('username', this.username);
          localStorage.setItem('profilePicUrl', this.profilePicUrl);
  
          this.authService.updateUserProfile({
            _id: this.userId,
            username: this.username,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            createdAt: this.createdAt,
            profilePicUrl: this.profilePicUrl
          });
  
          console.log('✅ Profil actualizat!');
          this.closeModal();
        },
        error: err => console.error('❌ Eroare la actualizare profil:', err)
      });
  }
  
  checkUsernameAvailability(): void {
    if (!this.tempUsername || this.tempUsername === this.username) {
      this.usernameError = null;
      return;
    }
  
    this.http.get<{ exists: boolean }>(`https://localhost:5000/api/users/check-username/${this.tempUsername}`)
      .subscribe(response => {
        this.usernameError = response.exists ? 'Username already taken.' : null;
      }, err => {
        console.error('❌ Eroare la verificarea username-ului:', err);
        this.usernameError = 'Server error.';
      });
  }

  selectLessonsForTest(): void {
  this.selectMode = true;
}

toggleLessonSelection(lessonId: string): void {
  if (!this.selectMode) return;
  if (this.selectedLessons.has(lessonId)) {
    this.selectedLessons.delete(lessonId);
  } else {
    this.selectedLessons.add(lessonId);
  }
}

cancelSelection(): void {
  this.selectMode = false;
  this.selectedLessons.clear();
}

generateTest(): void {
  console.log('📚 Lecții selectate pentru test:', [...this.selectedLessons]);
  // aici vei naviga sau deschide un modal pentru generarea testului
}


}
