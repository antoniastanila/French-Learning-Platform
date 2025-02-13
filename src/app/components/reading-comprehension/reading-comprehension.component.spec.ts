import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadingComprehensionComponent } from './reading-comprehension.component';

describe('ReadingComprehensionComponent', () => {
  let component: ReadingComprehensionComponent;
  let fixture: ComponentFixture<ReadingComprehensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadingComprehensionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadingComprehensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
