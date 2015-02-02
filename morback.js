
/*
 * 

    ##     ##  #######  ########  ########     ###     ######  ##    ## 
    ###   ### ##     ## ##     ## ##     ##   ## ##   ##    ## ##   ##  
    #### #### ##     ## ##     ## ##     ##  ##   ##  ##       ##  ##   
    ## ### ## ##     ## ########  ########  ##     ## ##       #####    
    ##     ## ##     ## ##   ##   ##     ## ######### ##       ##  ##   
    ##     ## ##     ## ##    ##  ##     ## ##     ## ##    ## ##   ##  
    ##     ##  #######  ##     ## ########  ##     ##  ######  ##    ## 
    01001101  01101111  01110010  01000010  01100001  01100011 01101011    

    {
        Authors  : 'BOUSSARD Quentin && MOREL Nicolas',
        Project  : {
            Name              : 'Morback',
            Deadline          : '19/05/2014',
            short_explanation : 'Make a Tic Tac Toe game with JS / XHR / PHP'
        },
        copyright : false,

    }
    
    quentinboussard.fr   &&   morelnicolas.com
    
 * 
 */

/*
 * Let's make a namespace  
 * 
 * no need to store 42 var in window
 */
var Morback = {};

/**********************************************
 *                 SOME VARS
 **********************************************/

Morback.version    = 1.0;

Morback.domElement = "#content";

//cocacola_user
Morback.user1 = {};

//pepsi_user
Morback.user2 = {};

//grids array
//NULL if empty and user if check by user
Morback.grid  = [];

/**********************************************
 *               GAME FUNCTION
 **********************************************/

/*
 * Init the game, set content and start
 * 
 * @returns {undefined}
 */
Morback.init = function()
{
    // /!\ carefuul: those functions need to be private /!\
    Morback.display.init();
    
    //Ajax function for save the game with ajax.php
    var reset = function()
    {
        var xhr = getXMLHttpRequest();
        xhr.onreadystatechange = Morback.init;
        
        xhr.open("POST", "ajax.php", true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('reset=true');
    };
    
    // retrieve data from server : if there's a current game
    var retrieve_data_from_serveur = function()
    {
       // debugger;
        
        var xhr = getXMLHttpRequest();
        xhr.onreadystatechange = function() 
        {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) 
            {
                var json = JSON.parse(xhr.responseText);
                
                //cocacola_user
                Morback.user1 = {
                    id         : 1,
                    nickname   : json.user1.nickname,
                    isComputer : json.user1.isComputer,
                    yourTurn   : json.user1.yourTurn
                    
                };

                //pepsi_user
                Morback.user2 = {
                    id         : 2,
                    nickname   : json.user2.nickname,
                    isComputer : json.user2.isComputer,
                    yourTurn   : json.user2.yourTurn
                };

                //grids array
                //NULL if empty and user if check by user
                Morback.grid = json.grid;

                //show grid when everysing is loaded
                Morback.display.showGrid();
            }
        };
        
        xhr.open("POST", "ajax.php", true);
        xhr.send(null);
    }();
    
    //If click on reset we launch the reset function
    document.getElementById("reset").addEventListener('click', reset);
};

// recursive function 
Morback.continue = function()
{
    // /!\ carefuul: those functions need to be private /!\
    
    var save = function ()
    {
        //table for save all user and the grid
        var save ={
            'user1' : Morback.user1,
            'user2' : Morback.user2,
            'grid'  : Morback.grid
        };


        var xhr = getXMLHttpRequest();
        xhr.onreadystatechange = function() 
        {

        };

        xhr.open("POST", "ajax.php", true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('json='+JSON.stringify(save));


    };

    var gameEnded = function ()
    {
        //if user1 or user2 win it's the end of the game
        if(winGame(Morback.user1) || winGame(Morback.user2))
        {
            return true;
        }
        //if the grid is full it's the end
        for (var i=0; i< Morback.grid.length; i++ )
        {
            if(Morback.grid[i] == null)
                return false;
        }
        return true;
    };

    var setInformation = function(information)
    {
        document.getElementById("information").innerHTML = "<p class='information'>"+information+"</p>";
    };

    var winGame = function(user)
    {

       var x1 =0;
       var x2 =0;
       var x3 =0;

       var y1 =0;
       var y2 =0;
       var y3 =0;

       var z1 =0;
       var z2 =0;

        for (var i=0; i< Morback.grid.length; i++ )
        {
            //We increment if one compartment is mark
            if(Morback.grid[i] != null && Morback.grid[i].id == user.id)
            {
                if (i>=0 && i<3)
                {
                    x1++;
                }
                if (i>=3 && i<6)
                {
                    x2++;
                }
                if (i>=6 && i<9)
                {
                    x3++;
                }


                if (i==0 || i==3 || i==6)
                {
                    y1++;
                }
                if (i==1 || i==4 || i==7)
                {
                    y2++;
                }
                if (i==2 || i==5 || i==8)
                {
                    y3++;
                }

                if (i==0 || i==4 || i==8)
                {
                    z1++;
                }
                if (i==2 || i==4 || i==6)
                {
                    z2++;
                }

            }
        }
        return (x1 == 3 || x2 == 3 || x3 == 3 || y1 == 3 || y2 == 3 || y3 == 3 || z1 == 3 || z2 == 3 );
    };
    
    if (gameEnded())
    {  
            if(winGame(Morback.user1))
            {
                setInformation ('gg ' +Morback.user1.nickname);
            }
            else if(winGame(Morback.user2))
            {
                setInformation ('gg ' +Morback.user2.nickname);
            }
            else
            {
                setInformation ('partie nul');
            }
        save();
        //display the grid again
        Morback.display.showGrid(true);
    }
    else
    {
        //we change the turn of player
         Morback.user1.yourTurn = !Morback.user1.yourTurn;
         Morback.user2.yourTurn = !Morback.user2.yourTurn;

        //if currentPlayer = Morback.user1.yourTurn then currentPlayer = Morback.user1 Otherwise currentPlayer = Morback.user2
         var currentPlayer = Morback.user1.yourTurn
                           ? Morback.user1
                           : Morback.user2;

        if (currentPlayer.isComputer)
        {
            //computer check the grid if is empty
             for (var i=0; i< Morback.grid.length; i++ )
             {
                 if (Morback.grid[i] == null)
                 {
                     Morback.grid[i] = currentPlayer;
                     break;
                 }
             }
             Morback.continue();
        }
        else
        {
            save();
            Morback.display.showGrid();
            Morback.setInformation ('a toi de jouer '+ currentPlayer.nickname);
        }
    }
    // save current game -> send to server
};

Morback.check = function()
{
    var number = parseInt(this.className,10);
    if (Morback.user1.yourTurn)
    {
        Morback.grid[number-1] = Morback.user1;
    }
    else
    {
        Morback.grid[number-1] = Morback.user2;
    }
   
    Morback.continue();
};

/**********************************************
 *                  DISPLAY
 **********************************************/

Morback.display = {};

Morback.display.init = function()
{
    var context = document.querySelector(Morback.domElement);
    context.innerHTML = "<div id='information'></div> <input type='button' id='reset' name='reset' value='recommencer'><div id='grid'></div>";
};

Morback.display.showGrid = function(gameEnded)
{
    var domGrid = document.querySelector(Morback.domElement + " #grid");
    
    domGrid.innerHTML = "<div>"
                        +"<span class='1'></span><span class='2'></span><span class='3'></span>"
                        +"<span class='4'></span><span class='5'></span><span class='6'></span>"
                        +"<span class='7'></span><span class='8'></span><span class='9'></span>"
                        +"</div>";
            
    for (var i=0; i< Morback.grid.length; i++ )
    {
        var element = domGrid.querySelector("span:nth-child("+(i+1)+")");
        
        if (Morback.grid[i] != null)
        {
           
           // if it's coca
           if (Morback.grid[i].id === 1)
           {
               element.innerHTML = "<img alt='coca' src='coca.png'>";
           }
           else
           {
               element.innerHTML = "<img alt='pepsi' src='pepsi.png'>";
           }
        }
        else
        {
           if(!gameEnded)
           {
               // addEventListener if click
               element.addEventListener("click", Morback.check);
           }
               
        }
    }
};

function getXMLHttpRequest() {
	var xhr = null;

	if (window.XMLHttpRequest || window.ActiveXObject) {
		if (window.ActiveXObject) {
			try {
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) {
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
		} else {
			xhr = new XMLHttpRequest(); 
		}
	} else {
		alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
		return null;
	}

	return xhr;
}
