import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeginnerMainPageComponent } from './beginner-main-page.component';

describe('MainPageComponent', () => {
  let component: BeginnerMainPageComponent;
  let fixture: ComponentFixture<BeginnerMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeginnerMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeginnerMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
