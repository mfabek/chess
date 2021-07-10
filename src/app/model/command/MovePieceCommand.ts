export class MovePieceCommand {
  name: string;
  board: string;

  constructor(name: string, board: string) {
    this.name = name;
    this.board = board;
  }
}
