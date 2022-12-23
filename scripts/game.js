// Getting the elements
//#region

const titlePage = document.getElementById("title-page");
const gameArea = document.getElementById("game-area");
const board = document.getElementById("board");
const iconArea = document.getElementById("icon-area");
const destroyerIcon = document.getElementById("destroyer-icon");
const destroyer2Icon = document.getElementById("destroyer2-icon");
const cruiserIcon = document.getElementById("cruiser-icon");
const submarineIcon = document.getElementById("submarine-icon");
const battleshipIcon = document.getElementById("battleship-icon");
const carrierIcon = document.getElementById("carrier-icon");

//#endregion

// Properties
//#region

let diffDict = new Map()
diffDict.set("easy", { boardSize: 5,
                       numShips: 3,
                       ships: [ new Ship(2, "Destroyer", destroyerIcon), 
                                new Ship(2, "Destroyer", destroyer2Icon), 
                                new Ship(3, "Cruiser", cruiserIcon) ] });
diffDict.set("medium", { boardSize: 7,
                         numShips: 4,
                         ships: [ new Ship(2, "Destroyer", destroyerIcon), 
                                  new Ship(2, "Destroyer", destroyer2Icon), 
                                  new Ship(3, "Cruiser", cruiserIcon), 
                                  new Ship(4, "Battleship", battleshipIcon) ] });
diffDict.set("hard", { boardSize: 10,
                       numShips: 5,
                       ships: [ new Ship(2, "Destroyer", destroyerIcon), 
                                new Ship(3, "Cruiser", cruiserIcon), 
                                new Ship(3, "Submarine", submarineIcon), 
                                new Ship(4, "Battleship", battleshipIcon), 
                                new Ship(5, "Carrier", carrierIcon) ] });
let tileSize;
let boardPixels;
let tiles = [];
let currentDiff;

//#endregion

function StartGame() {
    HideElement(titlePage);
    ShowElement(gameArea);
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
        ship.showIcon();
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