registerGame("template",undefined,function(){
    
    let state;
    let players;
    
    let id;
    
    this.start = function(_div, _id, _players){
 
        players = _players;
        state.turn = 0;
        
        for (let i = 0; i < players; i++) state.score[i] = 0;
        
        _div.innerHTML = `
        <h2>Template Game</h2>
        
        <table id='table_Score'>
        
            <tr>
                <th>Player</th>
                <th>Score</th>
            </tr>`;
        
        for (let i = 0; i < players.length(); i++) _div.innerHTML += `
            
            <tr>
                <td>` + players[i] + `</td>
                <td id='td_Player` + i + `Score'>0</td>
            </tr>`;
            
        }
        
        _div.innerHTML += `
        
        </table>
        
        <br/>
        
        <h3 id='txt_Turn'></h3>
        
        <formdata id='group_Actions'>
        
            <button id='btn_GetScore'>Increase score (+1/click).</button>
            
            <button id='btn_EndTurn'>End Turn</button>
            
        </formdata>
        
        `;
        
        _div.querySelector("#btn_GetScore").addEventListener("click",()=>{
            
            state.score[id] ++;
            
        });
        
        _div.querySelector("#btn_EndTurn").addEventListener("click",()=>{
           
            state.turn = (state.turn + 1) % players.length();
            transmit(state);
            
        });
        
        
        transmit(state);
    
    }

    this.render = function(_state){
    
        state = _state;
    
        for (let i = 0; i < players.length(); i++) _div.querySelector("#td_Player" + i + "Score").innerHTML = state.score[i];
             
        if (state.turn == id){
            
            _div.querySelector("#txt_Turn").innerHTML = "Your turn!";
            _div.querySelector("#group_Actions").disabled = false;
        
        } else {
            
            _div.querySelector("#txt_Turn").innerHTML = players[state.turn] + " to play.";
            _div.querySelector("#group_Actions").disabled = true;
            
        }
    }
    
});
