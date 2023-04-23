import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCrcComponent } from './form-crc.component';

describe('FormCrcComponent', () => {
  let component: FormCrcComponent;
  let fixture: ComponentFixture<FormCrcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormCrcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCrcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
