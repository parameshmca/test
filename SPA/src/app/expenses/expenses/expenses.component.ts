import { Component, OnInit } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { first } from 'rxjs/operators';
import { User } from '@app/_models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.less']
})
export class ExpensesComponent implements OnInit {
  user: User | null;
  loading = false;
  res_data:any;
  budget_list:any
  form!: FormGroup;
  showForm = false;
  submitted = false;
  months = [{id:'1', name:'Jan'}, {id:'2', name:'Feb'},
  {id:'3', name:'Mar'},{id:'4', name:'Apr'},{id:'5', name:'May'},
  {id:'6', name:'Jun'},{id:'7', name:'Jul'},{id:'8', name:'Aug'},
  {id:'9', name:'Sep'},{id:'10', name:'Oct'},{id:'11', name:'Nav'},
  {id:'12', name:'Dec'},];

  constructor(private accountService: AccountService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private router: Router,
    ) {
    this.user = this.accountService.userValue;
    this.getData();
    this.showForm = false
}

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      month: ['', Validators.required],
      description: ['', Validators.required],
      config_budget_id: ['', Validators.required],
      amount: ['', Validators.required],
    });

  }

  hideForm()
  {
    this.showForm = false;
    this.submitted = false;
    this.loading =false;
  }
  create()
  {
    this.form.reset();
    this.showForm = true;
    this.submitted = false;
    this.loading =false;
  }

   // convenience getter for easy access to form fields
   get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    this.loading = true;
    let param :any;
    param = this.form.value;
    this.accountService.create_expenses(param).subscribe(res => {
        // alert('hi');
        this.showForm = false;
        this.submitted = false;
        this.loading =false;
        this.getData();
    })
      
}

  getData()
  {   
      this.loading = true;
      this.accountService.expenses()
          .pipe(first())
          .subscribe({
              next: (res:any) => {
                console.log(res);
                this.res_data = res.data;
                this.budget_list = res.budget_list;
              },
              error: error => {
                  this.alertService.error(error);
                  this.loading = false;
              }
          });



  }
}
