// Getting the elements
//#region

const titlePage = document.getElementById("title-page");
const board = document.getElementById("board");

//#endregion

// Properties
//#region

let tileSize = 300;
let boardSize = 2;
let boardPixels = 600;
let tiles = [];

//#endregion

function StartGame() {
    HideElement(titlePage);
    ShowElement(board);
}

function Easy() {
    boardSize = 5;

    GenerateBoard();
}

function Medium() {
    boardSize = 7;

    GenerateBoard();
}

function Hard() {
    boardSize = 10;

    GenerateBoard();
}

function GenerateBoard() {
    let dim = GetSmallestDim();
    tileSize = RoundDownToNearestMult(dim / boardSize, 25);
    boardPixels = (tileSize + 8) * boardSize + (Math.floor(tileSize / 2));

    while (boardPixels > dim) {
        tileSize = tileSize - 25;
        boardPixels = (tileSize + 8) * boardSize + (Math.floor(tileSize / 2));
    }

    board.style.width = `${boardPixels}px`;
    board.style.height = `${boardPixels}px`;
    board.innerHTML = "";
    StartGame();

    for (let i = 0; i < boardSize**2; i++) {
        board.innerHTML += `<div class=\"tile\" style=\"width: ${tileSize}px; height: ${tileSize}px\"></div>`;
    }

    let tiles = document.getElementsByClassName("tile");

    for (let tile of tiles) {
        tile.addEventListener("click", () => {
            ShootShip(tile)
        });
    }
}

function ShootShip(ship) {
    let currentShipBGY = (ship.style.backgroundPositionY == "") ? 0 : parseInt(ship.style.backgroundPositionY);
    ship.style.backgroundPositionY = `${currentShipBGY + tileSize}px`;
}