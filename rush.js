var game_table = [];
var game_score = 0;
var best_score = 0;
var game_won = false;

var width_board = 4;
var height_board = 4;

var save_length = 3;
var table_of_saves = [];
var table_of_score = [];


// Forme d'une tuile
// {pos_x: 1, pos_y: 2, value: 4, can_fusion: true};

// Permet de voir s'il reste une cellule libre
function empty_cell_available() {
    for (var y = 0; y < height_board; y++) {
        for (var x = 0; x < width_board; x++) {
            if (game_table[y][x] == null) {
                return true
            }
        }
    }
    return false;
}

// Trouve une cellule aleatoire vide
function find_random_empty_cell() {
    if (empty_cell_available() == false) {
        return null;
    }

    while (1) {
        var pos_x = Math.floor(Math.random() * width_board);
        var pos_y = Math.floor(Math.random() * height_board);
        if (game_table[pos_y][pos_x] == null) {
            return {pos_y: pos_y, pos_x: pos_x};
        }
    }
}

// Genere une tuile aleatoirement et la place sur une cellule
function generate_tile() {
    if (empty_cell_available() == false) {
        return null;
    }

    var tile = {}

    var proba = Math.floor(Math.random() * 101); // generate a number between 0 and 100
    if (proba < 90) {
        tile.value = 2;
    } else {
        tile.value = 4;
    }

    var cell = find_random_empty_cell();
    tile.pos_x = cell.pos_x;
    tile.pos_y = cell.pos_y;
    tile.id = Math.floor(Math.random() * 10001);

    return tile;
}

function update_score() {
    $(".score_value").text(game_score);
    if (game_score > best_score) {
        $(".best_score_value").text(game_score);
        best_score = game_score;
    } else {
        $(".best_score_value").text(best_score);
    }
}

function draw_tiles() {
    $(".game_tile").remove();

    for (var y = 0; y < height_board; y++) {
        for (var x = 0; x < width_board; x++) {
            if (game_table[y][x] != null) {
                var cell_to_draw = $(".game_table > .game_row:eq("+y+") > .game_cell:eq("+x+")")[0];
                $("body").append($("<div class='game_tile game_tile_"+game_table[y][x].value+"'></div>"))
                $(".game_tile").last().css("position", "absolute");
                console.log($(".game_table > .game_row:eq(1) > .game_cell"));
                $(".game_tile").last().css("top", cell_to_draw.offsetTop);
                $(".game_tile").last().css("left", cell_to_draw.offsetLeft);
                $(".game_tile").last().css("width", cell_to_draw.clientWidth);
                $(".game_tile").last().css("height", cell_to_draw.clientHeight);
            }
        }
    }
}

function set_can_fusion_to_all() {
    for (var y = 0; y < height_board; y++) {
        for (var x = 0; x < width_board; x++) {
            if (game_table[y][x] != null) {
                game_table[y][x].can_fusion = true;
            }
        }
    }
}

// HANDLING RIGHT MOVE
function right_action_possible() {
    for (var y = 0; y < height_board; y++) {
        for (var x = 0; x < width_board - 1; x++) {
            if (game_table[y][x] != null && ((game_table[y][x + 1] == null) || (game_table[y][x].value == game_table[y][x + 1].value))) {
                return true
            }
        }
    }
    return false;
}

function right_find_prev_tile(y_param, x_param) {
    var x_tile = x_param;
    var y_tile = y_param;
    for (var x = x_tile - 1; x >= 0; x--) {
        if (game_table[y_tile][x] != null) {
            return game_table[y_tile][x];
        }
    }
    return null;
}

function right_fusion() {
    for (var y = 0; y < height_board; y++) {
        for (var x = width_board - 1; x > 0; x--) {
            if (game_table[y][x] != null && game_table[y][x].can_fusion == true) {
                var prev_tile = right_find_prev_tile(y, x);
                if ((prev_tile != null) && (prev_tile.value == game_table[y][x].value) && (prev_tile.can_fusion == true)) {
                    game_table[y][x].value = 2 * game_table[y][x].value;
                    game_score += game_table[y][x].value;
                    game_table[y][x].can_fusion = false;
                    game_table[prev_tile.pos_y][prev_tile.pos_x] = null;
                }
            }
        }
    }
}

function right_find_last_empty_cell(tile) {
    if (tile.pos_x == width_board - 1) {
        return width_board - 1;
    }
    for (var x = tile.pos_x + 1; x < width_board; x++) {
        if (game_table[tile.pos_y][x] != null) {
            return x - 1;
        }
    }
    return width_board - 1;
}

function right_move_tiles() {
    for (var y = 0; y < height_board; y++) {
        for (var x = width_board - 1; x >= 0; x--) {
            if (game_table[y][x] != null) {
                let new_pos_x = right_find_last_empty_cell(game_table[y][x]);
                if (new_pos_x != x) {
                    game_table[y][x].pos_x = new_pos_x;
                    game_table[y][new_pos_x] = game_table[y][x];
                    game_table[y][x] = null;    
                }
            }
        }
    }
}


// HANDLING LEFT MOVE
function left_action_possible() {
    for (var y = 0; y < height_board; y++) {
        for (var x = width_board - 1; x > 0; x--) {
            if (game_table[y][x] != null && ((game_table[y][x - 1] == null) || (game_table[y][x].value == game_table[y][x - 1].value))) {
                return true;
            }
        }
    }
    return false;
}

function left_find_prev_tile(y_param, x_param) {
    var x_tile = x_param;
    var y_tile = y_param;
    for (var x = x_tile + 1; x < width_board; x++) {
        if (game_table[y_tile][x] != null) {
            return game_table[y_tile][x];
        }
    }
    return null;
}

function left_fusion() {
    for (var y = 0; y < height_board; y++) {
        for (var x = 0; x < width_board; x++) {
            if (game_table[y][x] != null && game_table[y][x].can_fusion == true) {
                var prev_tile = left_find_prev_tile(y, x);
                if ((prev_tile != null) && (prev_tile.value == game_table[y][x].value) && (prev_tile.can_fusion == true)) {
                    game_table[y][x].value = 2 * game_table[y][x].value;
                    game_score += game_table[y][x].value;
                    game_table[y][x].can_fusion = false;
                    game_table[prev_tile.pos_y][prev_tile.pos_x] = null;
                }
            }
        }
    }
}

function left_find_last_empty_cell(tile_1) {
    if (tile_1.pos_x == 0) {
        return 0;
    }
    for (var j = tile_1.pos_x - 1; j >= 0; j--) {
        if (game_table[tile_1.pos_y][j] != null) {
            return j + 1;
        }
    }
    return 0;
}

function left_move_tiles() {
    for (var y = 0; y < height_board; y++) {
        for (var x = 0; x < width_board; x++) {
            if (game_table[y][x] != null) {
                var new_pos_x = left_find_last_empty_cell(game_table[y][x]);
                if (new_pos_x != x) {
                    game_table[y][x].pos_x = new_pos_x;
                    game_table[y][new_pos_x] = game_table[y][x];
                    game_table[y][x] = null;    
                }
            }
        }
    }
}


// HANDLING UP MOVE
function up_action_possible() {
    for (var x = 0; x < width_board; x++) {
        for (var y = height_board - 1; y > 0; y--) {
            if (game_table[y][x] != null && ((game_table[y - 1][x] == null) || (game_table[y][x].value == game_table[y - 1][x].value))) {
                return true;
            }
        }
    }
    return false;
}

function up_find_prev_tile(y_param, x_param) {
    var x_tile = x_param;
    var y_tile = y_param;
    for (var i = y_tile + 1; i < height_board; i++) {
        if (game_table[i][x_tile] != null) {
            return game_table[i][x_tile];
        }
    }
    return null;
}

function up_fusion() {
    for (var x = 0; x < width_board; x++) {
        for (var y = 0; y < height_board; y++) {
            if (game_table[y][x] != null && game_table[y][x].can_fusion == true) {
                var prev_tile = up_find_prev_tile(y, x);
                if ((prev_tile != null) && (prev_tile.value == game_table[y][x].value) && (prev_tile.can_fusion == true)) {
                    game_table[y][x].value = 2 * game_table[y][x].value;
                    game_score += game_table[y][x].value;
                    game_table[y][x].can_fusion = false;
                    game_table[prev_tile.pos_y][prev_tile.pos_x] = null;
                }
            }
        }
    }
}

function up_find_last_empty_cell(tile_1) {
    if (tile_1.pos_y == 0) {
        return 0;
    }
    for (var j = tile_1.pos_y - 1; j >= 0; j--) {
        if (game_table[j][tile_1.pos_x] != null) {
            return j + 1;
        }
    }
    return 0;
}

function up_move_tiles() {
    for (var x = 0; x < width_board; x++) {
        for (var y = 0; y < height_board; y++) {
            if (game_table[y][x] != null) {
                var new_pos_y = up_find_last_empty_cell(game_table[y][x]);
                if (new_pos_y != y) {
                    game_table[y][x].pos_y = new_pos_y;
                    game_table[new_pos_y][x] = game_table[y][x];
                    game_table[y][x] = null;
                }
            }
        }
    }
}

// HANDLING DOWN MOVE
function down_action_possible() {
    for (var x = 0; x < width_board; x++) {
        for (var y = 0; y < height_board - 1; y++) {
            if (game_table[y][x] != null && ((game_table[y + 1][x] == null) || (game_table[y][x].value == game_table[y + 1][x].value))) {
                return true;
            }
        }
    }
    return false;
}

function down_find_prev_tile(y_param, x_param) {
    var x_tile = x_param;
    var y_tile = y_param;
    for (var i = y_tile - 1; i >= 0; i--) {
        if (game_table[i][x_tile] != null) {
            return game_table[i][x_tile];
        }
    }
    return null;
}

function down_fusion() {
    for (var x = 0; x < width_board; x++) {
        for (var y = height_board - 1; y >= 0; y--) {
            if (game_table[y][x] != null && game_table[y][x].can_fusion == true) {
                var prev_tile = down_find_prev_tile(y, x);
                if ((prev_tile != null) && (prev_tile.value == game_table[y][x].value) && (prev_tile.can_fusion == true)) {
                    game_table[y][x].value = 2 * game_table[y][x].value;
                    game_score += game_table[y][x].value;
                    game_table[y][x].can_fusion = false;
                    game_table[prev_tile.pos_y][prev_tile.pos_x] = null;
                }
            }
        }
    }
}

function down_find_last_empty_cell(tile_1) {
    if (tile_1.pos_y == height_board - 1) {
        return height_board - 1;
    }
    for (var j = tile_1.pos_y + 1; j < height_board; j++) {
        if (game_table[j][tile_1.pos_x] != null) {
            return j - 1;
        }
    }
    return height_board - 1;
}

function down_move_tiles() {
    for (var x = 0; x < width_board; x++) {
        for (var y = height_board - 1; y >= 0; y--) {
            if (game_table[y][x] != null) {
                var new_pos_y = down_find_last_empty_cell(game_table[y][x]);
                if (new_pos_y != y) {
                    game_table[y][x].pos_y = new_pos_y;
                    game_table[new_pos_y][x] = game_table[y][x];
                    game_table[y][x] = null;
                }
            }
        }
    }
}

function clone_tail(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone_tail(obj[attr]);
        }
        return copy;
    }
}

function save_game_table() {
    if (table_of_saves.length == save_length) {
        table_of_saves.shift();
    }
    var save = [];
    for (var y = 0; y < height_board; y++) {
        save.push([]);
        for (var x = 0; x < width_board; x++) {
            if (game_table[y][x] != null) {
                save[y].push(clone_tail(game_table[y][x]));
            } else {
                save[y].push(null);
            }
        }
    }
    table_of_saves.push(save);
} 

function save_game_score() {
    if (table_of_score.length == save_length) {
        table_of_score.shift();
    }

    table_of_score.push(game_score);
}

function verify_game_over() {
    if (right_action_possible() == false &&
        left_action_possible() == false &&
        up_action_possible() == false &&
        down_action_possible() == false) {
            if (confirm("Game over")) {
                init_game();
            }
        }
}

function verify_win() {
    if (game_won) {return};
    for (var x = 0; x < width_board; x++) {
        for (var y = 0; y < height_board; y++) {
            if (game_table[y][x] != null && game_table[y][x].value == 2048) {
                $('#ex2').modal();
                game_won = true;
            }
        }
    }
}

function right_action() {
    if (right_action_possible() == false) {
        return ;
    }
    save_game_table();
    save_game_score();

    set_can_fusion_to_all();
    right_fusion();
    right_move_tiles();

    var new_tile = generate_tile();
    game_table[new_tile.pos_y][new_tile.pos_x] = new_tile;

    draw_tiles();
    update_score();
    verify_game_over();
    verify_win();
}

function left_action() {
    if (left_action_possible() == false) {
        return ;
    }
    save_game_table();
    save_game_score();

    set_can_fusion_to_all();
    left_fusion();
    left_move_tiles();

    var new_tile = generate_tile();
    game_table[new_tile.pos_y][new_tile.pos_x] = new_tile;

    draw_tiles();
    update_score();
    verify_game_over();
    verify_win();
}

function up_action() {
    if (up_action_possible() == false) {
        return ;
    }
    save_game_table();
    save_game_score();

    set_can_fusion_to_all();
    up_fusion();
    up_move_tiles();

    var new_tile = generate_tile();
    game_table[new_tile.pos_y][new_tile.pos_x] = new_tile;

    draw_tiles();
    update_score();
    verify_game_over();
    verify_win();
}

function down_action() {
    if (down_action_possible() == false) {
        return ;
    }
    save_game_table();
    save_game_score();

    set_can_fusion_to_all();
    down_fusion();
    down_move_tiles();

    var new_tile = generate_tile();
    game_table[new_tile.pos_y][new_tile.pos_x] = new_tile;

    draw_tiles();
    update_score();
    verify_game_over();
    verify_win();
}

function undo_action() {
    if (table_of_saves.length == 0) {
        return;
    }

    game_table = table_of_saves.pop();
    game_score = table_of_score.pop();
    draw_tiles();
    update_score();
}

function init_game() {
    let size = prompt("Please choose your square size from 2 to 6. (default 4)");
    if (isNaN(size) || size < 2 || size > 6) {
        size = 4;
    }
    $(".game_row").remove();
    game_table = [];
    game_score = 0;
    game_won = false;
    table_of_saves = [];
    table_of_score = [];
    width_board = size;
    height_board = size;
    for (var y = 0; y < height_board; y++) {
        game_table.push([])
        $(".game_table").append($("<div class='game_row'></div>"))
        for (var x = 0; x < width_board; x++) {
            $(".game_row").last().append($("<div class='game_cell'></div>"))
            game_table[y].push(null);
        }
    }

    var first_tile = generate_tile();
    game_table[first_tile.pos_y][first_tile.pos_x] = first_tile;

    var second_tile = generate_tile();
    game_table[second_tile.pos_y][second_tile.pos_x] = second_tile;

    update_score();
    draw_tiles();
}

$(document).ready(function() {
    init_game();

    $(window).on('resize', function(){
        draw_tiles();
    });

    $(".replay_button").on('click', function() {
        init_game();
    });  

    $("body").keydown(function(event) {
        console.log(event.key);
        switch (event.key) {
            case "Backspace":
                undo_action();
                break;
            case "ArrowUp":
                up_action();
                break;
            case "ArrowDown":
                down_action();
                break;
            case "ArrowLeft":
                left_action();
                break;
            case "ArrowRight":
                right_action();
                break;
        }
    });
});