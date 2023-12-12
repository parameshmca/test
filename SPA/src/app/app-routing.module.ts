import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';
import { ConfigBudgetsComponent } from './config/config-budgets/config-budgets.component';
import { ExpensesComponent } from './expenses/expenses/expenses.component';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
   { path: 'config_budget', component: ConfigBudgetsComponent, canActivate: [AuthGuard] },
   { path: 'expenses', component: ExpensesComponent, canActivate: [AuthGuard] },
    // { path: 'expenses', loadChildren: expenseModule, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }