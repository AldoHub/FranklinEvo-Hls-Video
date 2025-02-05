import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NexphaseComponent } from './nexphase.component';

describe('NexphaseComponent', () => {
  let component: NexphaseComponent;
  let fixture: ComponentFixture<NexphaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NexphaseComponent]
    });
    fixture = TestBed.createComponent(NexphaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
