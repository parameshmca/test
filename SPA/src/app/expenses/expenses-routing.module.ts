import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpensesComponent } from './expenses/expenses.component';


const routes: Routes = [
    {
        path: '', component: ExpensesComponent,
        children: [
            { path: 'create', component: ExpensesComponent },
            { path: 'edit/:id', component: ExpensesComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExpensesRoutingModule { }