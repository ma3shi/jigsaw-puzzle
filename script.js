'use strict';

//パズルの一片
class Piece {
  constructor(puzzle) {
    this.dragStartIndex; //ドラッグスタート地点のインデックス
    this.puzzle = puzzle;
  }

  //パズルの一片作成
  createPuzzlePiece(num) {
    //画像
    const puzzlePieceImg = document.createElement('img'); //imgタグ作成
    puzzlePieceImg.classList.add('draggable'); //クラス追加
    puzzlePieceImg.src = `img/park_${num}.jpg`; //画像
    puzzlePieceImg.setAttribute('data-number', num); //データ属性追加
    puzzlePieceImg.setAttribute('draggable', true); //要素をDrag可能にする(htmlで使用)
    this.addEventListeners(puzzlePieceImg); //イベントリスナー関数実行

    //パズル一片
    const puzzlePiece = document.createElement('div'); //divタグ作成
    puzzlePiece.classList.add('piece'); //クラス追加
    puzzlePiece.appendChild(puzzlePieceImg); //imgを子要素へ

    return puzzlePiece;
  }

  dragStart(e) {
    this.dragStartIndex = +e.target.closest('div').getAttribute('data-index'); //+でnumberへ
  }

  dragEnter(e) {
    e.target.classList.add('over');
  }

  dragLeave(e) {
    e.target.classList.remove('over');
  }

  dragOver(e) {
    // dragoverイベントが起きたとき、デフォルトの動作(現在のドラッグ操作をリセット)を明示的に止める必要
    e.preventDefault();
  }

  dragDrop(e) {
    const dropIndex = e.target.closest('div').getAttribute('data-index');
    this.puzzle.swapPieces(this.dragStartIndex, dropIndex); //piece交換
    e.target.classList.remove('over'); //クラス削除
  }

  // イベントリスナー
  addEventListeners(piece) {
    piece.addEventListener('dragstart', e => this.dragStart(e));
    piece.addEventListener('dragover', e => this.dragOver(e));
    piece.addEventListener('drop', e => this.dragDrop(e));
    piece.addEventListener('dragenter', e => this.dragEnter(e));
    piece.addEventListener('dragleave', e => this.dragLeave(e));
  }
}

//　パズル
class Puzzle {
  constructor() {
    this.piece = new Piece(this);
    this.puzzleContainer = document.getElementById('puzzle-container'); //パズル全体
    const checkBtn = document.getElementById('check'); //チェックボタン
    this.puzzlePieces = []; //パズル断片
    this.puzzlePiecesNum = 16; //パズル断片数

    checkBtn.addEventListener('click', () => this.checkPuzzle()); // チェックボタン
    this.initPuzzle();
  }

  //　数字配列を作成
  createNumArray() {
    const numArray = []; //数字用配列
    for (let i = 0; i < this.puzzlePiecesNum; i++) {
      numArray[i] = i + 1;
    }
    return numArray;
  }

  //　パズル初期化
  initPuzzle() {
    const numArray = this.createNumArray(); //　数字配列を作成

    //パズル一式作成
    numArray.forEach(num => {
      this.puzzlePieces.push(this.piece.createPuzzlePiece(num));
    });

    //パズルをシャッフル
    for (let i = this.puzzlePieces.length - 1; i > 0; i--) {
      const randomNum = Math.floor(Math.random() * this.puzzlePieces.length);
      const temp = this.puzzlePieces[i];
      this.puzzlePieces[i] = this.puzzlePieces[randomNum];
      this.puzzlePieces[randomNum] = temp;
    }

    // パズルを配置
    this.puzzlePieces.forEach((puzzlePiece, index) => {
      console.log(puzzlePiece.firstChild);
      puzzlePiece.setAttribute('data-index', index); //データ属性追加
      this.puzzleContainer.appendChild(puzzlePiece); //子要素へ
    });
  }

  //piece交換
  swapPieces(startIndex, dropIndex) {
    const imgOne = this.puzzlePieces[startIndex].querySelector('.draggable');
    const imgTwo = this.puzzlePieces[dropIndex].querySelector('.draggable');

    this.puzzlePieces[startIndex].appendChild(imgTwo);
    this.puzzlePieces[dropIndex].appendChild(imgOne);
  }

  //パズルチェック
  checkPuzzle() {
    this.puzzlePieces.forEach((puzzlePiece, index) => {
      const img = puzzlePiece.querySelector('.draggable');
      const num = +img.getAttribute('data-number');
      if (num === index + 1) {
        puzzlePiece.classList.remove('wrong');
      } else {
        puzzlePiece.classList.add('wrong');
        console.log(puzzlePiece);
      }
    });
  }
}

new Puzzle();
