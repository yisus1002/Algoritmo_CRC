import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgorithmCrcComponent } from './algorithm-crc.component';

describe('AlgorithmCrcComponent', () => {
  let component: AlgorithmCrcComponent;
  let fixture: ComponentFixture<AlgorithmCrcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlgorithmCrcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlgorithmCrcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
