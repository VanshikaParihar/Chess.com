// const socket=io()

// const chess=new Chess();
// const boardElement=document.querySelector(".chessboard")
// let draggedPiece=null;
// let sourceSquare=null;
// let playerRole=null;

// const renderBoard=()=>{
// const board=chess.board();
// boardElement.innerHTML="";
// board.forEach((row,rowindex)=>{
//     row.forEach((square,squareindex)=>{
//         const squareElement=document.createElement("div");
//         squareElement.classList.add(
//             "square",
//             (rowindex + squareindex)%2 ===0? "light" : "dark"
//         );
//         squareElement.dataset.row=rowindex;
//         squareElement.dataset.col=squareindex;


//         if(square){
//             const pieceElement=document.createElement("div");
//             pieceElement.classList.add(
//                 "piece",
//                 square.color === "w" ? "white" : "black"
//             );
//             pieceElement.innerText=getPieceUnicode(square)
//             pieceElement.draggable=playerRole===square.color;

//             pieceElement.addEventListener("dragstart",(e)=>{
//                 if(pieceElement.draggable){
//                     draggedPiece=pieceElement;
//                     sourceSquare={row:rowindex,col:squareindex};
//                     e.dataTransfer.setData("text/plain","")
//                 }
//             });
//             pieceElement.addEventListener("dragend",(e)=>{
//                 draggedPiece=null;
//                 sourceSquare=null;
//             });
//             squareElement.appendChild(pieceElement);
//         }
//         squareElement.addEventListener("dragover",function(e){
//             e.preventDefault();
//         });
//         squareElement.addEventListener("drop",(e)=>{
//             e.preventDefault();
//             if(draggedPiece){
//                 const targetSquare={
//                     row:parseInt(squareElement.dataset.row),
//                     col:parseInt(squareElement.dataset.col)

//                 };
//                 handleMove(sourceSquare,targetSquare)
//             }
//         })
//         boardElement.appendChild(squareElement);
//     })
// })
// }
// const handleMove=(source,target)=>{
// const move={
//     from:`${String.fromCharCode(97+source.col)}${8-source.row}`,
//     to:`${String.fromCharCode(97+target.col)}${8-target.row}`,
//     promotion:'q'
// };
// socket.emit("move",move);
// }
// const getPieceUnicode=(piece)=>{
// const unicodePieces = {
//     w: { k: "♔", q: "♕", r: "♖", b: "♗", n: "♘", p: "♙" },
//     b: { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" }
//   };
//   return unicodePieces[piece.color][piece.type] || "";
// }
// socket.on("playerRole",function(role){
//     playerRole=role;
//     renderBoard();
// });
// socket.on("spectatorRole",function(){
//     playerRole=null;
//     renderBoard();
// });
// socket.on("boardState",function(fen){
//     chess.load(fen)
//     renderBoard();
// });
// socket.on("move",function(move){
//     chess.move(move);
//     renderBoard();
// });
//****************************************** */

// Connect to socket server
const socket = io();

// Initialize chess logic
const chess = new Chess();

// Select the chessboard element
const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

// Function to render the board visually
const renderBoard = () => {
  const board = chess.board();
  boardElement.innerHTML = "";

  board.forEach((row, rowIndex) => {
    row.forEach((square, colIndex) => {
      const squareElement = document.createElement("div");
      squareElement.classList.add(
        "square",
        (rowIndex + colIndex) % 2 === 0 ? "light" : "dark"
      );
      squareElement.dataset.row = rowIndex;
      squareElement.dataset.col = colIndex;

      // If a piece is present, render it
      if (square) {
        const pieceElement = document.createElement("div");
        pieceElement.classList.add(
          "piece",
          square.color === "w" ? "white" : "black"
        );
        pieceElement.innerText = getPieceUnicode(square);

        // Allow dragging only for the current player's pieces
        pieceElement.draggable = playerRole === square.color;

        pieceElement.addEventListener("dragstart", (e) => {
          if (pieceElement.draggable) {
            draggedPiece = pieceElement;
            sourceSquare = { row: rowIndex, col: colIndex };
            e.dataTransfer.setData("text/plain", ""); // required for Firefox
          }
        });

        pieceElement.addEventListener("dragend", () => {
          draggedPiece = null;
          sourceSquare = null;
        });

        squareElement.appendChild(pieceElement);
      }

      // Allow dropping on all squares
      squareElement.addEventListener("dragover", (e) => e.preventDefault());

      squareElement.addEventListener("drop", (e) => {
        e.preventDefault();
        if (draggedPiece && sourceSquare) {
          const targetSquare = {
            row: parseInt(squareElement.dataset.row),
            col: parseInt(squareElement.dataset.col),
          };
          handleMove(sourceSquare, targetSquare);
        }
      });

      boardElement.appendChild(squareElement);
    });
  });

  // Flip board if player is black
  if (playerRole === "b") {
    boardElement.classList.add("flipped");
  } else {
    boardElement.classList.remove("flipped");
  }
};

// Function to handle moves
const handleMove = (source, target) => {
  const move = {
    from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
    to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
    promotion: "q", // always promote to queen for simplicity
  };
  socket.emit("move", move);
};

// Function to return Unicode piece symbols
const getPieceUnicode = (piece) => {
  const unicodePieces = {
    w: { k: "♔", q: "♕", r: "♖", b: "♗", n: "♘", p: "♙" },
    b: { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" },
  };
  return unicodePieces[piece.color][piece.type] || "";
};

// Socket listeners

// Assign player role
socket.on("playerRole", function (role) {
  playerRole = role;
  renderBoard();
});

// For spectators
socket.on("spectatorRole", function () {
  playerRole = null;
  renderBoard();
});

// Update board when FEN is received
socket.on("boardState", function (fen) {
  chess.load(fen);
  renderBoard();
});

// Update board after a move
socket.on("move", function (move) {
  chess.move(move);
  renderBoard();
});
