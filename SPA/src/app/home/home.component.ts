import { Component, OnInit } from '@angular/core';
import { User } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
import { first } from 'rxjs/operators';
import * as Highcharts from 'highcharts';



@Component({ templateUrl: 'home.component.html' })

export class HomeComponent implements OnInit {
    user: User | null;
    loading = false;
    myBudget:any;
    budget_expenses:any;
    myExpense:any;
    monthly_expenses:any;
    constructor(private accountService: AccountService,
        private alertService: AlertService
        ) {
        this.user = this.accountService.userValue;
        this.getData();
    }
    
    ngOnInit(): void {
        
      }

    initChart() {
        
        Highcharts.chart('pie_chart', {
          title: {
            text: 'Budget Vs Expenses'
          },
          series: [{
            // data: [1, 2, 3, 4, 5],
            data: [{
                name: 'Budget',
                y: parseFloat(this.myBudget),
                sliced: true,
                selected: true
            }, {
                name: 'Expense',
                y: parseFloat(this.myExpense)
            }],
            type: 'pie'
          }]
        });


        var seriesData: { name: any; y: number; }[] = [];
        var cats: any[] = [];
        this.monthly_expenses.forEach((key:any,value:any)=>{
            var series = {'name' : key.month,'y':parseFloat(key.amount)};
            seriesData.push(series);
            cats.push(key.month);

         });
         console.log(seriesData);
        Highcharts.chart('bar_chart', {

            title: {
              text: 'Each Month Expenses'
            },
            xAxis: {
                categories: cats,
              },

              yAxis: {
                title: {
                  text: 'Amount'
                }
              },

            series: [{
                name: 'Expenses',

              data: seriesData,
              type: 'bar'
            }]
          });


        
      }

      


    getData()
    {   
        this.loading = true;
        this.accountService.dashboard()
            .pipe(first())
            .subscribe({
                next: (res:any) => {
                    console.log(res);
                    this.myBudget = res.exp_budget?.[0]?.myBudget;
                    this.myExpense = res.exp_budget?.[0]?.myExpense;
                    this.monthly_expenses = res.monthly_expenses
                    this.budget_expenses = res.budget_expenses
                    this.initChart();
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });



    }
    // 

    
}