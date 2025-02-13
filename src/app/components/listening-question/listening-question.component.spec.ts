import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeningQuestionComponent } from './listening-question.component';

describe('ListeningQuestionComponent', () => {
  let component: ListeningQuestionComponent;
  let fixture: ComponentFixture<ListeningQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeningQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeningQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
