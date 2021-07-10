import {Component, OnInit, ViewChild} from '@angular/core';
import {ChessProvider} from '../providers/chess.provider';
import {ToastrService} from 'ngx-toastr';
import {Subscription, timer} from 'rxjs';
import {NgxChessBoardView} from 'ngx-chess-board';
import {MovePieceCommand} from '../model/command/MovePieceCommand';

@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.scss']
})
export class ChessComponent implements OnInit {
  @ViewChild('board', {static: false}) board: NgxChessBoardView;
  timerSubscription: Subscription;
  timer2Subscription: Subscription;
  loading = false;

  constructor(public chessProvider: ChessProvider,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.timerSubscription = timer(1000, 1000)
      .subscribe(() => {
        this.chessProvider.getCount(this.chessProvider.name)
          .subscribe((data) => {
            if (data === 2) {
              this.chessProvider.onePlayer = false;
              this.toastr.success('Game starts! It is your turn!');
              this.getBoard();
              this.timerSubscription.unsubscribe();
            }
          });
      });
  }

  // send request to backend every second when it's not your turn
  getBoard(): void {
    this.timer2Subscription = timer(1000, 2000)
      .subscribe(() => {
        if (this.chessProvider.type !== this.playerTurn() && this.loading === false) {
          this.chessProvider.getBoard(this.chessProvider.name)
            .subscribe(data => {
              this.board.setFEN(data);
            });
        }
      });
  }

  // when board changed we save it in database
  boardChanged(): void {
    this.loading = true;
    const command: MovePieceCommand = new MovePieceCommand(this.chessProvider.name, this.board.getFEN());
    this.chessProvider.boardChanged(command)
      .subscribe(() => {
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      });
  }

  // function to detect which player is on turn
  private playerTurn(): string {
    return this.board.getFEN().split(' ')[1][0];
  }

}
