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
                       ships: [new Ship(2, "Destroyer"), new Ship(2, "Mine Sweeper"), new Ship(3, "Submarine")] });
diffDict.set("medium", { boardSize: 7,
                         numShips: 4,
                         ships: [new Ship(2, "Destroyer"), new Ship(2, "Mine Sweeper"), new Ship(3, "Submarine"), new Ship(4, "Battleship")] });
diffDict.set("hard", { boardSize: 10,
                       numShips: 5,
                       ships: [new Ship(2, "Destroyer"), new Ship(3, "Cruiser"), new Ship(3, "Submarine"), new Ship(4, "Battleship"), new Ship(5, "Carrier")] });
let tileSize;
let boardPixels;
let tiles = [];
let currentDiff;

//#endregion

function StartGame() {
    HideElement(titlePage);
    ShowElement(board);
}

function Easy() {
    currentDiff = diffDict.get("easy");
    Ship.createEmptyBoardList(currentDiff.boardSize)

    GenerateBoard();
    PlaceShips();
}

function Medium() {
    currentDiff = diffDict.get("medium");
    Ship.createEmptyBoardList(currentDiff.boardSize)

    GenerateBoard();
    PlaceShips();
}

function Hard() {
    currentDiff = diffDict.get("hard");
    Ship.createEmptyBoardList(currentDiff.boardSize)

    GenerateBoard();
    PlaceShips();
}

function GenerateBoard() {
    let dim = GetSmallestDim();
    tileSize = RoundDownToNearestMult(dim / Ship.boardSize, 25);
    boardPixels = (tileSize + 8) * Ship.boardSize + (Math.floor(tileSize / 2));

    while (boardPixels > dim) {
        tileSize = tileSize - 25;
        boardPixels = (tileSize + 8) * Ship.boardSize + (Math.floor(tileSize / 2));
    }

    board.style.width = `${boardPixels}px`;
    board.style.height = `${boardPixels}px`;
    board.innerHTML = "";
    StartGame();

    for (let i = 0; i < Ship.boardSize**2; i++) {
        board.innerHTML += `<div id=\"${i}\" class=\"tile\" style=\"width: ${tileSize}px; height: ${tileSize}px\"></div>`;
    }

    let tiles = document.getElementsByClassName("tile");

    for (let tile of tiles) {
        tile.addEventListener("click", () => {
            Shoot(tile)
        });
    }
}

function PlaceShips() {
    for (let ship of currentDiff.ships) {
        ship.tryPlace();
    }
}

function Shoot(tile) {
    if (Ship.isShipHere[parseInt(tile.id)]) {
        console.log("Hit!")
        tile.style.backgroundPositionY = `${tileSize}px`;
        let shipSection = Ship.locToShipDict.get(tile.id).section;
        let ship = Ship.locToShipDict.get(tile.id).shipInstance;
        shipSection.isHit = true;
        ship.checkSunk();
        if (ship.isSunk) {
            console.log(`You sunk the ${ship.name}!`);
        }
        let allShipsSunk = true;
        for (let ship of currentDiff.ships) {
            if (!ship.isSunk) {
                allShipsSunk = false;
            }
        }
        if (allShipsSunk) {
            console.log("You have sunk all ships!");
        }
    }
    else {
        tile.style.backgroundPositionY = `${tileSize * 2}px`;
    }
}