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
  checkmate = false;
  whoWon: string;

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
              if (this.chessProvider.type === 'w') {
                this.toastr.success('Game starts! It is your turn!');
              } else {
                this.toastr.success('Game starts! Wait for your turn!');
              }
              this.getBoard();
              this.timerSubscription.unsubscribe();
            }
          });
      });
  }

  // send request to backend every second when it's not your turn
  getBoard(): void {
    this.timer2Subscription = timer(1000, 1000)
      .subscribe(() => {
        if (this.chessProvider.type !== this.playerTurn() && this.loading === false) {
          this.chessProvider.getBoard(this.chessProvider.name)
            .subscribe(data => {
              if (data === '') {
                console.log('prazno');
                this.board.setFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
              } else {
                this.board.move(data);
              }
            });
        }
      });
  }

  // when board changed we save it in database
  boardChanged(): void {
    this.loading = true;
    const command: MovePieceCommand = new MovePieceCommand(this.chessProvider.name, this.board.getFEN(), this.board.getMoveHistory());
    this.chessProvider.boardChanged(command)
      .subscribe(data => {
        setTimeout(() => {
          if (data.isCheckmate === true) {
            this.checkmate = true;
            this.whoWon = data.whoWon;
            const winner = data.whoWon === 'b' ? 'Black ' : 'White ';
            this.toastr.success('Game over! ' + winner + 'won!');
          }
          this.loading = false;
        }, 1000);
      });
  }

  showAllMoves(): void {

  }

  reset(): void {
    this.chessProvider.reset(this.chessProvider.name)
      .subscribe(() => {
        this.board.reset();
        this.checkmate = false;
        this.whoWon = '';
      });
  }

  // function to detect which player is on turn
  playerTurn(): string {
    if (this.board !== undefined) {
      return this.board.getFEN().split(' ')[1][0];
    }
  }

}
