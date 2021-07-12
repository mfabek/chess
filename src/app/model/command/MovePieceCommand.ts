import {HistoryMove} from 'ngx-chess-board';

export class MovePieceCommand {
  name: string;
  board: string;
  move: string;

  constructor(name: string, board: string, moves: HistoryMove[]) {
    this.name = name;
    this.board = board;
    this.move = moves.pop().move;
  }
}
