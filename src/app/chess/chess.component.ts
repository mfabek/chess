import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChessProvider} from '../providers/chess.provider';
import {ToastrService} from 'ngx-toastr';
import {Subscription, timer} from 'rxjs';
import {NgxChessBoardView} from 'ngx-chess-board';
import {MovePieceCommand} from '../model/command/MovePieceCommand';
import { WebSocketProvider } from '../providers/web-socket.provider';
import { SseService } from '../providers/sseHandlers';

@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.scss']
})
export class ChessComponent implements OnInit, OnDestroy {
  @ViewChild('board', {static: false}) board: NgxChessBoardView;
  @ViewChild('boardForAllMoves', {static: false}) boardForAllMoves: NgxChessBoardView;
  timerSubscription: Subscription;
  timer2Subscription: Subscription;
  loading = false;
  checkmate = false;
  whoWon: string;
  isVisible = false;
  allMovesBoardIndex = 0;
  allMoveBoards: string[] = [];
  subscription: Subscription;

  constructor(public chessProvider: ChessProvider,
              private toastr: ToastrService,
              private socketProvider: WebSocketProvider,
              private sseService: SseService) {
  }

  ngOnInit(): void {
    this.subscription = this.sseService.gameStartSubject.subscribe((data) => {
      if (data) {
        this.chessProvider.onePlayer = false;
        // if (this.chessProvider.type === 'w') {
          this.toastr.success('Game starts! It is your turn!');
        // }
      }
    });
    this.getBoard();
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }

  getBoard(): void {
    this.sseService.boardSubject
      .subscribe((data: string) => {
        // if (this.chessProvider.type !== this.playerTurn() && this.loading === false) {
          if (data === '') {
            this.board.setFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
          } else if (data) {
            this.board.move(data);
          }
        // }
      });
  }

  // when board changed we save it in database
  boardChanged(): void {
    // this.loading = true;
    const command: MovePieceCommand = new MovePieceCommand(
      this.chessProvider.name, 
      this.board.getFEN(), 
      this.board.getMoveHistory(), 
      this.chessProvider.type === 'w'
    );
    this.chessProvider.boardChanged(command)
      .subscribe(data => {
        // this.socketProvider.sendBoardMessage(this.chessProvider.name);
          if (data.isCheckmate === true) {
            this.checkmate = true;
            this.whoWon = data.whoWon;
            const winner = data.whoWon === 'b' ? 'Black ' : 'White ';
            this.toastr.success('Game over! ' + winner + 'won!');
            this.allMovesBoardIndex = 0;
          }
          else {
            this.checkmate = false;
          }
          // this.loading = false;
      });
  }

  showAllMoves(): void {
    this.isVisible = true;
    this.chessProvider.getAllMoves(this.chessProvider.name)
      .subscribe(data => {
        this.allMoveBoards = data;
        this.boardForAllMoves.setFEN(this.allMoveBoards[this.allMovesBoardIndex]);
      });
  }

  reset(): void {
    this.chessProvider.reset(this.chessProvider.name)
      .subscribe(() => {
        this.board.reset();
        this.checkmate = false;
        this.whoWon = '';
        this.allMovesBoardIndex = 0;
        // this.socketProvider.sendBoardMessage(this.chessProvider.name);
      });
  }

  // function to load previous move
  loadLeftMoveBoard(): void {
    this.boardForAllMoves.setFEN(this.allMoveBoards[--this.allMovesBoardIndex]);
  }

  // function to load next move
  loadRightMoveBoard(): void {
    this.boardForAllMoves.setFEN(this.allMoveBoards[++this.allMovesBoardIndex]);
  }

  // function to detect which player is on turn
  playerTurn(): string {
    if (this.board !== undefined) {
      return this.board.getFEN().split(' ')[1][0];
    }
  }

}
