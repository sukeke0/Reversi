// define constant value
var BOARD_SIZE = {
    'WIDTH' :8,
    'HEIGHT':8,
};

var BLOCK_KIND = {
    'NONE'   : 0,
    'BLACK'  : 1,
    'WHITE'  : 2,
    'MAX'    : 3,
};

var SQUARE_SIZE = {
    'WIDTH'  : 31,
    'HEIGHT' : 31,
};

var SLEEP_KIND = {
    'TURNOVER'  : 1000,
};

var isComputer = false;
var isFirst = false;
var stone;
var board = [];
var player_color;

var getCountIsPossibleToTurnOver = function(x, y, dx, dy) {

    var count = 0;
    var cx = x + dx;
    var cy = y + dy;

    if (( cx < 0 || BOARD_SIZE.WIDTH < cx) ||
        ( cy < 0 || BOARD_SIZE.HEIGHT < cy)) {

        return 0;
    }

    while(board[cx][cy] == BLOCK_KIND.MAX - player_color) {
        count++;
        cx += dx;
        cy += dy;

        if (( cx < 0 || BOARD_SIZE.WIDTH < cx) ||
            ( cy < 0 || BOARD_SIZE.HEIGHT < cy)) {

            return 0;
        }
    }

    if (count > 0 && board[cx][cy] == player_color) {
        return count;
    }

    return 0;
};

var turnOverStraight = function(x, y, dx, dy) {

    var cx = x + dx;
    var cy = y + dy;

    while(board[cx][cy] == BLOCK_KIND.MAX - player_color) {
        board[cx][cy] = player_color;
        cx += dx;
        cy += dy;
    }
};

var turnOverBlock = function(x, y, flip) {

    var total = 0;

    // can not put block
    if (board[x][y] != BLOCK_KIND.NONE) {
        return total;
    }
    
    // check for 8 direction whether it is possible to turn over block
    for (var dx = -1; dx <= 1; dx++) {
        for(var dy = -1; dy <= 1; dy++) {

            if (dx == 0 && dy == 0) {
                continue;
            }
            
            var cnt = getCountIsPossibleToTurnOver(x, y, dx, dy);
            if (cnt > 0) {
                total += cnt;
                if (flip) {
                    turnOverStraight(x, y, dx, dy);
                }
            }
        }
    }

    return total;
};

var showBoard = function() {

    var b = document.getElementById("board");

    while(b.firstChild) {
        b.removeChild(b.firstChild);
    }
    
    for(var y = 0; y < BOARD_SIZE.HEIGHT; y++) {
        for(var x = 0; x < BOARD_SIZE.WIDTH; x++) {
            var square = stone[board[x][y]].cloneNode(true);
            
            square.style.left = ((x) * SQUARE_SIZE.WIDTH) + "px"; 
            square.style.top = ((y) * SQUARE_SIZE.HEIGHT) + "px"; 
            b.appendChild(square);
            
            (function() {
                var _x = x;
                var _y = y;
                square.onclick = function() {
                    if (turnOverBlock(_x, _y, true) > 0) {
                        board[_x][_y] = player_color;
                        showBoard();
                        if (!changePlayer()) {
                            doAiPlayer();
                        } 
                    }
                };
            })();
        }
    }

    showProgress();
};

var showProgress = function() {

    var black = 0;
    var white = 0;

    for(var y = 0; y < BOARD_SIZE.HEIGHT; y++) {
        for(var x = 0; x < BOARD_SIZE.WIDTH; x++) {
            if (board[x][y] == BLOCK_KIND.BLACK) {
                black++;
            } else if (board[x][y] == BLOCK_KIND.WHITE) {
                white++;
            } else {
                // no opereation
            }
        }
    }

    var msg = document.getElementById("msg");
    
    msg.innerHTML = "progress of territory  black:"+black+" white:"+white;
};

var changePlayer = function() {
    
    var pass = false;

    player_color = BLOCK_KIND.MAX - player_color;

    if (isPass()) {
        if(player_color == BLOCK_KIND.BLACK) {
            alert("Black is pass");
        } else if (player_color == BLOCK_KIND.WHITE) {
            alert("White is pass");
        } else {
            alert("invalid status");
        }
        
        player_color = BLOCK_KIND.MAX - player_color;

        if(isPass()) {
            alert("Game set");
        }

        pass = true;
    }

    return pass;
};

var doAiPlayer = function() {

    if(!isComputer) {
        return false;
    }

    if( (isFirst && (player_color == BLOCK_KIND.BLACK)) ||
        (!isFirst && (player_color == BLOCK_KIND.WHITE)) ) {
        return false;
    }

    for(var y = 0; y < BOARD_SIZE.HEIGHT; y++) {
        for(var x = 0; x < BOARD_SIZE.WIDTH; x++) {
            
            if (turnOverBlock(x, y, true) > 0) {
                board[x][y] = player_color;
                showBoard();
                if(changePlayer()) {
                    doAiPlayer();
                }
                return true;
            }
        }
    }
    
    return false;
};

var isPass = function() {
    
    for(var y = 0; y < BOARD_SIZE.HEIGHT; y++) {
        for(var x = 0; x < BOARD_SIZE.WIDTH; x++) {
            
            if (turnOverBlock(x, y, false) > 0) {
                return false;
            }
        }
    }

    return true;
};

var msleep = function(ms) {

    var d1 = new Date().getTime();
    var d2 = new Date().getTime();
    while ( d2 < (d1 + ms) ) {
        d2 = new Date().getTime();
    }
};

var initBoard = function() {

    player_color = BLOCK_KIND.BLACK;

    // 0:none, 1:black, 2:white
    stone = [
        document.getElementById("none"),
        document.getElementById("black"),
        document.getElementById("white")
    ];

    // init zero value
    for (var i = 0; i < BOARD_SIZE.HEIGHT+1; i++) {
        board[i] = [];
        for (var j = 0; j < BOARD_SIZE.WIDTH+1; j++) {
            board[i][j] = BLOCK_KIND.NONE;
        }
    }

    // initial position
    board[3][4] = BLOCK_KIND.BLACK;
    board[4][3] = BLOCK_KIND.BLACK;
    board[3][3] = BLOCK_KIND.WHITE;
    board[4][4] = BLOCK_KIND.WHITE;

};

onload = function() {
    // just in case
    Object.freeze(BLOCK_KIND);
    Object.freeze(BOARD_SIZE);
    Object.freeze(SQUARE_SIZE);
    
    // initialize board
    initBoard();
    // start game
    showBoard();
};

var OnClickButton = function() {
    if(document.form1.Computer.checked) {
        isComputer = true;
    } else {
        isComputer = false;
    }
    
    if(document.form1.First.checked) {
        isFirst = true;
    } else {
        isFirst = false;
    }

    // initialize board
    initBoard();

    // start game
    showBoard();

    if(!isFirst) {
        doAiPlayer();
    }
};

