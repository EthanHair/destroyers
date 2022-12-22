// Getting the elements
//#region

const titlePage = document.getElementById("title-page");
const board = document.getElementById("board");

//#endregion

// Properties
//#region

let diffDict = new Map()
diffDict.set("easy", { boardSize: 5,
                       numShips: 3,
                       ships: [new Ship(2), new Ship(2), new Ship(3)] });
diffDict.set("medium", { boardSize: 7,
                         numShips: 3,
                         ships: [new Ship(2), new Ship(3), new Ship(4)] });
diffDict.set("hard", { boardSize: 10,
                       numShips: 3,
                       ships: [new Ship(2), new Ship(3), new Ship(4), new Ship(5)] });
let tileSize = 300;
let boardPixels = 600;
let tiles = [];
let currentDiff;

//#endregion

function StartGame() {
    HideElement(titlePage);
    ShowElement(board);
}

function Easy() {
    currentDiff = diffDict.get("easy");
    Ship.boardSize = currentDiff.boardSize;

    GenerateBoard();
    PlaceShips();
}

function Medium() {
    currentDiff = diffDict.get("medium");
    Ship.boardSize = currentDiff.boardSize;

    GenerateBoard();
    PlaceShips();
}

function Hard() {
    currentDiff = diffDict.get("medium");
    Ship.boardSize = currentDiff.boardSize;

    GenerateBoard();
    PlaceShips();
}

function GenerateBoard() {
    let dim = GetSmallestDim();
    tileSize = RoundDownToNearestMult(dim / currentDiff.boardSize, 25);
    boardPixels = (tileSize + 8) * currentDiff.boardSize + (Math.floor(tileSize / 2));

    while (boardPixels > dim) {
        tileSize = tileSize - 25;
        boardPixels = (tileSize + 8) * currentDiff.boardSize + (Math.floor(tileSize / 2));
    }

    board.style.width = `${boardPixels}px`;
    board.style.height = `${boardPixels}px`;
    board.innerHTML = "";
    StartGame();

    for (let i = 0; i < currentDiff.boardSize**2; i++) {
        board.innerHTML += `<div id=\"${i}\" class=\"tile\" style=\"width: ${tileSize}px; height: ${tileSize}px\"></div>`;
        Ship.isShipHere.push(false);
    }

    let tiles = document.getElementsByClassName("tile");

    for (let tile of tiles) {
        tile.addEventListener("click", () => {
            ShootShip(tile)
        });
    }
}

function PlaceShips() {

}

function ShootShip(ship) {
    if (Ship.isShipHere[parseInt(ship.id)]) {
        ship.style.backgroundPositionY = `${tileSize}px`;
    }
    else {
        ship.style.backgroundPositionY = `${tileSize * 2}px`;
    }
}