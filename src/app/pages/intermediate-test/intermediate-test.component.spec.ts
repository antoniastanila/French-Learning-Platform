import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntermediateTestComponent } from './intermediate-test.component';

describe('IntermediateTestComponent', () => {
  let component: IntermediateTestComponent;
  let fixture: ComponentFixture<IntermediateTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntermediateTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntermediateTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
