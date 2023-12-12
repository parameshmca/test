import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigBudgetsComponent } from './config-budgets/config-budgets.component';


const routes: Routes = [
    {
        path: '', component: ConfigBudgetsComponent,
        children: [
            { path: 'list', component: ConfigBudgetsComponent },
            // { path: 'edit/:id', component: ConfigBudgetsComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConfigRoutingModule { }