registerGame("tictactoe", {maxPlayers:2}, function () {
    let state = {};
    let players = [];

    let id;
    let _div;
    this.start = function (div, _id, _players) {
        _div = div;
        players = _players;
        state.turn = 0;
        state.board=".........";
        id=players.indexOf(_id);
        _div.innerHTML=`
        <h1> You're playing as ${id?"X":"O"}.</h1>
        <h2 id="txt_turn"> It's your turn!</h2>
        <fieldset>
        <table><tr><td><button>.</button></td><td><button>.</button></td><td><button>.</button></td></tr><tr><td><button>.</button></td><td><button>.</button></td><td><button>.</button></td></tr><tr><td><button>.</button></td><td><button>.</button></td><td><button>.</button></td></tr></table>
        </fieldset>
        `;
        String.prototype.replaceAt=function(index, replacement) {
            return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
        }
        function cnum(el){
            let count=0;
            while ((el=el.previousSibling)!=null){
                count++;
            }return count;
        }
        _div.addEventListener("click",(e)=>{
            if (!(e.target.matches("button")))return;
            let el=e.target.parentElement;
            let targetIndex=cnum(el)+3*cnum(el.parentElement);
            if (state.board[targetIndex]=="."){
                state.board=state.board.replaceAt(targetIndex,id?"X":"O");
                state.turn = (state.turn + 1) % players.length;
                transmit(state);
            }else{
                alert("That square has already been taken!");
            }
        })
        transmit(state);
    }

    this.recieve = function (_state) {

        state = _state;
        //update the board
        for (let i=0;i<state.board.length;i++){
            let el=_div.querySelector(`tr:nth-child(${Math.floor(i/3)+1}) td:nth-child(${i%3+1})`);
            if (state.board[i]!="."){
                el.innerHTML=`<p>${state.board[i]}</p>`;
            };
        }
        //detect 3 in a row, fire win if win
        //horizontal
        for (let i=0;i<3;i++){
            if (state.board[i]==state.board[i+3] && state.board[i+3]==state.board[i+6] && state.board[i+6]!="."){
                win(players[state.board[i]=='x'+0]);
            }
        }
        //vertical
        for (let i=0;i<7;i+=3){
            if (state.board[i]==state.board[i+1] && state.board[i+1]==state.board[i+2] && state.board[i+2]!="."){
                win(players[state.board[i]=='x'+0]);
            }
        }
        //diagonals
        if (state.board[0]==state.board[4] && state.board[4]==state.board[8] && state.board[8]!="."){
            win(players[state.board[0]=='x'+0]);
        }
        if (state.board[2]==state.board[4] && state.board[4]==state.board[6] && state.board[6]!="."){
            win(players[state.board[2]=='x'+0]);
        }


        if (state.turn == id) {
            _div.querySelector("fieldset").disabled=false;
            _div.querySelector("#txt_Turn").innerHTML = "Your turn!";

        } else {
            _div.querySelector("#txt_Turn").innerHTML = players[state.turn] + " to play.";
            _div.querySelector("fieldset").disabled=true;

        }
    }

});
