import { Component, OnInit } from '@angular/core';
import { AccountService, AlertService } from '@app/_services';
import { first } from 'rxjs/operators';
import { User } from '@app/_models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-config-budgets',
  templateUrl: './config-budgets.component.html',
  styleUrls: ['./config-budgets.component.less']
})
export class ConfigBudgetsComponent implements OnInit {
  user: User | null;
  loading = false;
  res_data:any;
  form!: FormGroup;
  showForm = false;
  submitted = false;
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
      name: ['', Validators.required],
      amount: ['', Validators.required]
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
    this.accountService.create_budget(param).subscribe(res => {
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
      this.accountService.config_budgets()
          .pipe(first())
          .subscribe({
              next: (res) => {
                console.log(res);
                this.res_data = res;
              },
              error: error => {
                  this.alertService.error(error);
                  this.loading = false;
              }
          });



  }

}
