import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.css']
})
export class AccessComponent implements OnInit{
  accessForm: FormGroup;

  constructor(private http: HttpService) { }

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
          }
        },
        (error) => {
          console.log(error);
          subscription.unsubscribe();
        }
      );
  }

}
