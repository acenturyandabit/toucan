registerGame("austrian", undefined, function () {

    let state = {};
    let players = [];
    let cards = [];
    let cardbuttons = {};

    let id;
    let div;
    
    this.start = function (_div, _id, _players, _isHost) {
        
        div = _div;
        players = _players;
        id = players.indexOf(_id);
        
        state.turn = 0;
        state.stack = [];
        state.cards = [];
        state.add = [];
        state.top = "";
        state.count = 0;
        state.totalcount = 0;
        state.alert = "";
        
        // listen up kids, this is how you shuffle a deck of cards.
        
        // first, figure out how many cards each person gets.
        for (let i = 0; i < players.length; i++){
            
            state.add[i] = [];
            
            if (i < (54 % players.length)) state.cards[i] = Math.ceil(54 / players.length); 
            else state.cards[i] = Math.floor(54 / players.length);
             
        }
        
        // now we magick a deck of cards and shuffle them!!
        let k = "AAAA222233334444555566667777888899990000JJJJQQQQKKKK**".split("");
        
        // by the pigeonhole principle, each card will be moved at least once!
        for (let i = 0; i < 1000; i++) {
         
            let a = Math.floor(Math.random() * k.length);
            let b = Math.floor(Math.random() * k.length);
            let t = k[a];
            k[a] = k[b];
            k[b] = t;
            
        }
        // that is how the pigeonhole principle works.
        
        // finally, give people the cards.
        for (let i = 0; i < k.length; i++) state.add[i % players.length].push(k[i]);

        // and so we have a shuffled deck of cards!
             
        let preinnerHTML = "";
        
        preinnerHTML = `
        <h2 id='txt_Title'>Austrian Cheat</h2>
        
        <table id='table_Score'>
        
            <tr>
                <th>Player</th>
                <th>Cards</th>
            </tr>`;

        for (let i = 0; i < players.length; i++){
            if (i != id) preinnerHTML += `
            
            <tr>
                <td>` + players[i] + `</td>
                <td id='td_Player` + i + `Cards'>0</td>
            </tr>`;
            else preinnerHTML += `
            
            <tr>
                <td style="background:rgb(60,255,60)">` + players[i] + `</td>
                <td id='td_Player` + i + `Cards'>0</td>
            </tr>`;
        }

        preinnerHTML += `
        
        </table>
        
        <br/>
        
        <h3 id='txt_Turn'></h3>
        <h4 id='txt_Top'></h4>
        <h4 id='txt_Last'></h4>
        
        <fieldset id='group_Actions'>
        
            <select id='select_Cards'></select>
            
            <button id='btn_Add'>Select</button>
            
            <button id='btn_Reset'>Reset</button>
            
            <h4>Selected cards:</h4>
            
            <div id='selectedCards'></div>
            
            <br/>
            
            <button id='btn_Cheat'>Cheat</button>
            
            <button id='btn_Play'>Play</button>
            
            <button id='btn_End'>End the game</button>
            
        </fieldset>
        
        `;
        
        div.innerHTML = preinnerHTML;
        
        div.querySelector("#btn_Add").addEventListener("click", () => {
            
            let selectElement = div.querySelector("#select_Cards");
            
            if (selectElement.selectedIndex == -1 || selectElement.value == "[selected]") return;
            
            div.querySelector("#selectedCards").innerHTML += "<button class='cardButton' id='b" + selectElement.selectedIndex + "'>" + selectElement.value + "</button>";
            selectElement.querySelector("#c" + selectElement.selectedIndex).innerHTML = "[selected]";
            div.querySelector("#b" + selectElement.selectedIndex).disabled = true;
            
        });
        
        div.querySelector("#btn_Play").addEventListener("click", () => {
            
            if (!div.querySelector("#selectedCards").children.length){
             
                alert("Select at least one card to play.");
                return;
                
            }
            
            state.count = div.querySelector("#selectedCards").children.length;
            state.totalcount += state.count;
            
            if (state.top == "") state.top = prompt("Claim the card/s to be (2 -> K):");
            while ("234567890JQK".indexOf(state.top) == -1) state.top = prompt("Invalid card. Claim the card/s to be (2 -> K):");
            if ("234567890JQK".indexOf(state.top) == -1) state.top = div.querySelector("#selectedCards").children[0].innerHTML;
            if ("234567890JQK".indexOf(state.top) == -1) state.top = "234567890JQK"[Math.floor(Math.random() * 12)];
                                                        
            for (let i = 0; i < div.querySelector("#selectedCards").children.length; i++){
                state.stack.push(div.querySelector("#selectedCards").children[i].innerHTML);
                cards.splice(cards.indexOf(div.querySelector("#selectedCards").children[i].innerHTML), 1);
            }
            
            let buttons = div.querySelectorAll(".cardButton");
            for (let i = 0; i < buttons.length; i++) buttons[i].remove();
            
            state.cards[id] = cards.length;
                                                        
            state.turn = (state.turn + 1) % players.length;
            transmit(state);

        });

        div.querySelector("#btn_Cheat").addEventListener("click", () => {
            
            let valid = true;
            for (let i = 1 ; i <= state.count; i++) valid &= (state.stack[state.stack.length - i] == state.top || state.stack[state.stack.length - i] == "*");
                                                         
            if (valid) {
                
                alert("Unsuccessful call! You pick up the stack and your turn is over.");
                
                for (let i = 0; i < state.stack.length; i++) cards.push(state.stack[i]);
                state.stack = [];
                state.top = "";
                state.cards[id] = cards.length;
                
                state.turn = (state.turn + 1) % players.length;
                transmit(state);
                
            } else {
                
                state.add[(id + players.length - 1) % players.length] = [];
                for (let i = 0; i < state.stack.length; i++) state.add[(id + players.length - 1) % players.length].push(state.stack[i]);
                state.cards[(id + players.length - 1) % players.length] += state.stack.length;
                state.alert = players[(id + players.length - 1) % players.length] + " was caught cheating and drew the " + state.stack.length + " card/s in the deck.";
                state.stack = [];
                state.top = "";
                transmit(state);
                
            }
            
        });
        
        div.querySelector("#btn_End").disabled = true;
        div.querySelector("#btn_End").addEventListener("click", () => {
                    
            if (confirm("End it? You will take the L.")) win("not " + players[id],[]);
                    
        });
        
        div.querySelector("#btn_Reset").addEventListener("click", () => {
                    
            let buttons = div.querySelectorAll(".cardButton");
            for (let i = 0; i < buttons.length; i++){
                div.querySelector("#c" + buttons[i].id.substr(1)).innerHTML = buttons[i].innerHTML;
                buttons[i].remove();
            }
                    
        });

        if (_isHost) transmit(state);

    }

    this.recieve = function (_state) {

        state = _state;
        
        if (state.alert != "") alert(state.alert);
        state.alert = "";
             
        if (state.add[id].length) for (let i = 0; i < state.add[id].length; i++) cards.push(state.add[id][i]);
        for (let i = 0; i < players.length; i++) state.add[i] = [];
        
        let count = {};
        for (let i = 0; i < 13; i++) count["A234567890JQK"[i]] = 0;
        
        for (let i = 0; i < cards.length; i++){
            
            count[cards[i]] ++;
        
        }
        
        for (let i = 0; i < 13; i++){
            
            if (count["A234567890JQK"[i]] >= 4) {
                
                if (i == 0) /* haha u lost */ win("not " + players[id],[]);
                
                count["A234567890JQK"[i]] = 0;
                while (cards.indexOf("A234567890JQK"[i]) != -1) cards.splice(cards.indexOf("A234567890JQK"[i]), 1);
                
            }
            
        }

        for (let i = 0; i < players.length; i++) div.querySelector("#td_Player" + i + "Cards").innerHTML = state.cards[i];

        div.querySelector("#select_Cards").innerHTML = ""
        
        for (let i = 0; i < cards.length; i++) div.querySelector("#select_Cards").innerHTML += "<option id='c" + i + "'>" + cards[i] + "</option>";
        
        if (state.top == ""){
            
            div.querySelector("#txt_Top").innerHTML = "The stack is empty! Play anything.";
            div.querySelector("#txt_Last").innerHTML = "The previous player made a bad call, or this is the first turn.";
            
        } else if (state.stack.length == 1) {
            
            div.querySelector("#txt_Top").innerHTML = "The stack contains a single " + state.top + ".";
            div.querySelector("#txt_Last").innerHTML = "The previous player played a single " + state.top + ".";
            
        } else {
            
            div.querySelector("#txt_Top").innerHTML = "The stack contains " + state.stack.length + " " + state.top + "'s.";
            if (state.count == 1) div.querySelector("#txt_Last").innerHTML = "The previous player played a single " + state.top + ".";
            else div.querySelector("#txt_Last").innerHTML = "The previous player played " + state.count + " " + state.top + "'s.";
            
        }
                                                    
        if (state.turn == id) {
            
            let players_left = players.length;
            for (let i = 0; i < players.length; i++) if (!state.cards[i]) players_left --;
            if (players_left == 2 && div.querySelector("#txt_title").innerHTML == "Austrian Cheat") {
                
                alert("You're one of two players left. Traditionally, the game stops here because it's pointless to continue. That said, you're free to go on. Or you can press the button below to end the game.");
                
                div.querySelector("#txt_title").innerHTML = "a silly test of mental stamina";
                div.querySelector("#btn_End").disabled = false;
                    
            }
            
            if (cards.length == 0){
            
                if (state.cards[id] == 0) alert("You won! Sit back and watch the rest of the game unfold, I guess.");
                else {
                    alert("So... either you hacked or someone else did. I'll give you the benefit of the doubt.");
                    // jokes, not like i have a choice TBH.
                    state.cards[id] = 0;
                }
                
                state.turn = (state.turn + 1) % players.length;
                transmit(state);
                
            }

            div.querySelector("#btn_Cheat").disabled = (state.top == "");
            div.querySelector("#txt_Turn").innerHTML = "Your turn!";
            div.querySelector("#group_Actions").disabled = false;

        } else {

            div.querySelector("#txt_Turn").innerHTML = players[state.turn] + " to play.";
            div.querySelector("#group_Actions").disabled = true;

        }
    }

});
