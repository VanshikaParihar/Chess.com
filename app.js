// const express=require('express')
// const socket=require('socket.io')
// const http=require('http')
// const {Chess}=require('chess.js')
// const path=require('path')

// const app=express();
// const server=http.createServer(app)
// const io=socket(server);

// const chess=new Chess();
// let players={};
// let currplayer="W"

// app.set("view engine",'ejs');
// app.use(express.static(path.join(__dirname,'public')))


// app.get('/',(req,res)=>{
//     res.render('index',{title:"Chess Game"});
// })


// io.on("connection",function(uniquesocket){
//     console.log("user connected...")


//    if(!players.white){
//     players.white=uniquesocket.id;
//     uniquesocket.emit("playerRole","w");
//    }
//    else if(!players.black){
//     players.white=uniquesocket.id;
//     uniquesocket.emit("playerRole","w");
//    }
//    else{
//     uniquesocket.emit("spectatorRole");
//    }

// uniquesocket.on("move",(move)=>{
//         try{
//             if(chess.turn()==="w" && uniquesocket.id !==players.white) return;
//             if(chess.turn() === "b" && uniquesocket.id !==players.black) return;
//             const result=chess.move(move);
//             if(result){
//                 currplayer=chess.turn();
//                 io.emit("move",move);
//                 io.emit("boardState",chess.fen() )//sends the curr position of ele on board and what they r in a form of a  string
//             }
//             else{
//                 console.log("Invalid move: ",move);
//                 uniquesocket.emit("inavlid move: ",move);
//             }
//         }
//         catch(err){
// console.log(err);
// uniquesocket.emit("invalid move: ",move);
//         }
//     })




// uniquesocket.on("disconnect",function(){
//     if(uniquesocket.id===players.white){
//         delete players.white;
//     }
//     else if(uniquesocket.id===players.black){
//         delete players.black;
//     }

    
// });

// });


// server.listen(3000,function(){
//         console.log("server started...")
    
// })



//************************************************************************** */
const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
let players = {};

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { title: "Chess Game" });
});

io.on("connection", function (uniquesocket) {
  console.log("user connected...");

  if (!players.white) {
    players.white = uniquesocket.id;
    uniquesocket.emit("playerRole", "w");
  } else if (!players.black) {
    players.black = uniquesocket.id;
    uniquesocket.emit("playerRole", "b");
  } else {
    uniquesocket.emit("spectatorRole");
  }

  // Send current board to the new player
  uniquesocket.emit("boardState", chess.fen());

  // Handle moves
  uniquesocket.on("move", (move) => {
    try {
      if (chess.turn() === "w" && uniquesocket.id !== players.white) return;
      if (chess.turn() === "b" && uniquesocket.id !== players.black) return;

      const result = chess.move(move);
      if (result) {
        io.emit("move", move);
        io.emit("boardState", chess.fen());
      } else {
        console.log("Invalid move: ", move);
        uniquesocket.emit("invalidMove", move);
      }
    } catch (err) {
      console.log(err);
      uniquesocket.emit("invalidMove", move);
    }
  });

  uniquesocket.on("disconnect", function () {
    console.log("user disconnected...");
    if (uniquesocket.id === players.white) {
      delete players.white;
    } else if (uniquesocket.id === players.black) {
      delete players.black;
    }
  });
});

server.listen(3000, function () {
  console.log("server started on http://localhost:3000");
});
