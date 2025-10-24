import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Catching } from './catching';

describe('Catching', () => {
  let component: Catching;
  let fixture: ComponentFixture<Catching>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Catching]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Catching);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
