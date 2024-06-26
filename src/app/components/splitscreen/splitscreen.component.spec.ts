import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitscreenComponent } from './splitscreen.component';

describe('SplitscreenComponent', () => {
  let component: SplitscreenComponent;
  let fixture: ComponentFixture<SplitscreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SplitscreenComponent]
    });
    fixture = TestBed.createComponent(SplitscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
