import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigRoutingModule } from './config-routing.module';
import { ConfigBudgetsComponent } from './config-budgets/config-budgets.component';



@NgModule({
  declarations: [
    ConfigBudgetsComponent,
    ConfigRoutingModule
  ],
  imports: [
    CommonModule,
    ConfigBudgetsComponent,
    ConfigRoutingModule
  ]
})
export class ConfigModule { }
