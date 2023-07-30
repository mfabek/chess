import {HistoryMove} from 'ngx-chess-board';

export class MovePieceCommand {
  name: string;
  board: string;
  move: string;
  whiteTurn: boolean;

  constructor(name: string, board: string, moves: HistoryMove[], whiteTurn: boolean) {
    this.name = name;
    this.board = board;
    this.move = moves.pop().move;
    this.whiteTurn = whiteTurn;
  }
}
