import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';


import { CommonModule } from '@angular/common';
import { ExpensesRoutingModule } from './expenses-routing.module';
import { ExpensesComponent } from './expenses/expenses.component';



@NgModule({
  declarations: [
    ExpensesComponent,
    ExpensesRoutingModule
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ExpensesComponent,
    ExpensesRoutingModule
  ]
})
export class ExpensesModule { }
