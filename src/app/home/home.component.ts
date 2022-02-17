import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ChessProvider} from '../providers/chess.provider';
import {ToastrService} from 'ngx-toastr';
import { WebSocketProvider } from '../providers/web-socket.provider';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  form: FormGroup;

  constructor(private router: Router,
              private chessProvider: ChessProvider,
              private toastr: ToastrService,
              private socketProvider: WebSocketProvider) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
    });
  }

  submitForm(): void {  
    this.chessProvider.join(this.form.controls.name.value)
      .subscribe((data) => {
        let message: string;
        switch (data) {
          case 0:
            this.chessProvider.name = this.form.controls.name.value;
            this.chessProvider.type = 'w';
            this.chessProvider.onePlayer = true;
            message = 'You created new game, please wait for another player.';
            this.router.navigate(['/game']).then();
            this.toastr.success(message);
            this.socketProvider.sendCountMessage(this.form.controls.name.value);
            break;
          case 1:
            this.chessProvider.name = this.form.controls.name.value;
            this.chessProvider.type = 'b';
            message = 'You joined the game, now the game can start.';
            this.router.navigate(['/game']).then();
            this.toastr.success(message);
            this.socketProvider.sendCountMessage(this.form.controls.name.value);
            break;
          case 2:
            message = 'This game already has two players.';
            this.toastr.error(message);
            break;
        }
      });
  }

}
