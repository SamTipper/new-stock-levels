import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.css']
})
export class AccessComponent implements OnInit{
  accessForm: FormGroup;

  constructor(
    private http: HttpService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.accessForm = new FormGroup({
      apiKey: new FormControl(null, Validators.required)
    });
  }

  onSubmit(): void{
    const subscription = 
      this.http.authUser(this.accessForm.value.apiKey).subscribe(
        (res) => {
          if (res.status === 200){
            localStorage.setItem("api-key", res.body);
            subscription.unsubscribe();
            this.toastr.success("Authorisation successful!");
            this.http.checkApiKey();
          }
        },
        (error) => {
          if (error.status === 401){
            this.toastr.warning("Invalid API key.");
          } else {
            this.toastr.error("An error has occurred, please try again later.");
          }
          console.log(error);
          subscription.unsubscribe();
          localStorage.setItem("api-key", "");
          this.http.checkApiKey();
        }
      );
    this.accessForm.reset();
  }

}
