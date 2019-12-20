import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodolistsItemComponent } from './todolists-item.component';

describe('TodolistsItemComponent', () => {
  let component: TodolistsItemComponent;
  let fixture: ComponentFixture<TodolistsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodolistsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodolistsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
