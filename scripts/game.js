// Getting the elements
//#region

const titlePage = document.getElementById("title-page");
const gameArea = document.getElementById("game-area");
const board = document.getElementById("board");
const iconArea = document.getElementById("icon-area");
const destroyerIcon = document.getElementById("destroyer-icon");
const destroyerIconArea = document.getElementById("destroyer-icon-area");
const destroyer2Icon = document.getElementById("destroyer2-icon");
const destroyer2IconArea = document.getElementById("destroyer2-icon-area");
const cruiserIcon = document.getElementById("cruiser-icon");
const cruiserIconArea = document.getElementById("cruiser-icon-area");
const submarineIcon = document.getElementById("submarine-icon");
const submarineIconArea = document.getElementById("submarine-icon-area");
const battleshipIcon = document.getElementById("battleship-icon");
const battleshipIconArea = document.getElementById("battleship-icon-area");
const carrierIcon = document.getElementById("carrier-icon");
const carrierIconArea = document.getElementById("carrier-icon-area");
const ammoLeftElement = document.getElementById("ammo-left");
const playerShip = document.getElementById("player-ship")

//#endregion

// Properties
//#region

let diffDict = new Map()
diffDict.set("easy", { boardSize: 5,
                       ammo: 15,
                       numShips: 3,
                       ships: [ new Ship(2, "Destroyer", destroyerIcon, destroyerIconArea), 
                                new Ship(2, "Destroyer", destroyer2Icon, destroyer2IconArea), 
                                new Ship(3, "Cruiser", cruiserIcon, cruiserIconArea) ] });
diffDict.set("medium", { boardSize: 7,
                         ammo: 30,
                         numShips: 4,
                         ships: [ new Ship(2, "Destroyer", destroyerIcon, destroyerIconArea), 
                                  new Ship(2, "Destroyer", destroyer2Icon, destroyer2IconArea), 
                                  new Ship(3, "Cruiser", cruiserIcon, cruiserIconArea), 
                                  new Ship(4, "Battleship", battleshipIcon, battleshipIconArea) ] });
diffDict.set("hard", { boardSize: 10,
                       ammo: 65,
                       numShips: 5,
                       ships: [ new Ship(2, "Destroyer", destroyerIcon, destroyerIconArea), 
                                new Ship(3, "Cruiser", cruiserIcon, cruiserIconArea), 
                                new Ship(3, "Submarine", submarineIcon, submarineIconArea), 
                                new Ship(4, "Battleship", battleshipIcon, battleshipIconArea), 
                                new Ship(5, "Carrier", carrierIcon, carrierIconArea) ] });
let tileSize;
let boardPixels;
let tiles = [];
let currentDiff;
let ammoLeft;
let playerShipAnimation;
let canPlayAnimation = true;

//#endregion

function StartGame() {
    HideElement(titlePage);
    ShowElement(gameArea);
}

function Easy() {
    currentDiff = diffDict.get("easy");

    GenerateBoard();
    PlaceShips();
}

function Medium() {
    currentDiff = diffDict.get("medium");

    GenerateBoard();
    PlaceShips();
}

function Hard() {
    currentDiff = diffDict.get("hard");

    GenerateBoard();
    PlaceShips();
}

function GenerateBoard() {
    Ship.createEmptyBoardList(currentDiff.boardSize)
    ammoLeft = currentDiff.ammo;
    ammoLeftElement.innerHTML = ammoLeft;

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

    tiles = document.getElementsByClassName("tile");

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
    if (Ship.isBoardGenerated && ammoLeft > 0 && !Ship.allShipsSunk) {
        PlayShipFireAnimation();
        ammoLeft--;
        ammoLeftElement.innerHTML = ammoLeft;

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
                Ship.allShipsSunk = true;
                console.log("You have sunk all ships!");
            }
        }
        else {
            tile.style.backgroundPositionY = `${tileSize * 2}px`;
        }
    }
}

function PlayShipFireAnimation() {
    canPlayAnimation = true;
    playerShipAnimation = setInterval(() => {
        let currentY = playerShip.style.backgroundPositionY == "" ? 0 : parseInt(playerShip.style.backgroundPositionY);
        if (canPlayAnimation) {
            if (currentY <= -512) {
                playerShip.style.backgroundPositionY = "0px";
                clearInterval(playerShipAnimation);
                canPlayAnimation = false;
            } else {
                playerShip.style.backgroundPositionY = `${currentY - 128}px`;
            }
        }
    }, (1000 / 8));
}