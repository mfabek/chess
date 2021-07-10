import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ChessProvider} from '../providers/chess.provider';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  form: FormGroup;

  constructor(private router: Router,
              private chessProvider: ChessProvider) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
    });
  }

  submitForm(): void {
    this.chessProvider.join(this.form.controls.name.value)
      .subscribe((data) => {
        console.log(data);
      });
    this.router.navigate(['/game']).then();
  }

}
