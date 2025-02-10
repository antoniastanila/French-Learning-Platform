import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeginnerTestComponent } from './beginner-test.component';

describe('BeginnerTestComponent', () => {
  let component: BeginnerTestComponent;
  let fixture: ComponentFixture<BeginnerTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeginnerTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeginnerTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
