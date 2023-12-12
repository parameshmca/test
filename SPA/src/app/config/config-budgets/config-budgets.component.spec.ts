import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigBudgetsComponent } from './config-budgets.component';

describe('ConfigBudgetsComponent', () => {
  let component: ConfigBudgetsComponent;
  let fixture: ComponentFixture<ConfigBudgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigBudgetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigBudgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
