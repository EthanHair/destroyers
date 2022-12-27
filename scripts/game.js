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
const playerShip = document.getElementById("player-ship");
const crosshairElement = document.getElementById("crosshairs");
const gameoverDialog = document.getElementById("gameover-dialog");
const gameoverText = document.getElementById("gameover-text");

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
                       ammo: 55,
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
let started = false;
let hasShotThere = [];
let canMoveCrosshairs = false;

//#endregion

function StartGame() {
    gameArea.classList.remove("blurred");
    HideElement(titlePage);
    ShowElement(gameArea);
    canMoveCrosshairs = true;
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
    hasShotThere = [];
    StartGame();

    for (let i = 0; i < Ship.boardSize**2; i++) {
        board.innerHTML += `<div id=\"${i}\" class=\"tile\" style=\"width: ${tileSize}px; height: ${tileSize}px\"></div>`;
        hasShotThere.push(false);
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
        ship.resetShip();
        ship.tryPlace();
        ship.showIcon();
    }
    
    setTimeout(() => {
        started = true;
    }, 500);
}

function Shoot(tile) {
    if (Ship.isBoardGenerated && ammoLeft > 0 && !Ship.allShipsSunk && !hasShotThere[parseInt(tile.id)]) {
        PlayShipFireAnimation();
        ammoLeft--;
        ammoLeftElement.innerHTML = ammoLeft;
        hasShotThere[parseInt(tile.id)] = true;

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
            
        }
        else {
            tile.style.backgroundPositionY = `${tileSize * 2}px`;
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
            GameOver("You have sunk all the ships!<br>Good job!");
        } else if (ammoLeft <= 0) {
            GameOver("You have run out of ammo!<br>Have better aim next time!")
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

function CheckTilesClick(x, y) {
    for (let i = 0; i < tiles.length; i++) {
        if (IsClickOnTile(x, y, tiles[i])) {
            Shoot(tiles[i]);
        }
    }
}

function IsClickOnTile(x, y, tile){
    let tileRect = tile.getBoundingClientRect();
    
    let tileMinX = tileRect.x;
    let tileMaxX = tileMinX + tileRect.width;
    let tileMinY = tileRect.y;
    let tileMaxY = tileMinY + tileRect.height;

    if (x >= tileMinX && x <= tileMaxX && y >= tileMinY && y <= tileMaxY) {
        return true;
    } else {
        return false;
    }
}

function IsInBoard(x, y) {
    let boardRect = board.getBoundingClientRect();
    
    let boardMinX = boardRect.x;
    let boardMaxX = boardMinX + boardRect.width;
    let boardMinY = boardRect.y;
    let boardMaxY = boardMinY + boardRect.height;

    if (x >= boardMinX && x <= boardMaxX && y >= boardMinY && y <= boardMaxY) {
        return true;
    } else {
        return false;
    }
}

window.addEventListener("mousemove", function(e) {
    if (IsInBoard(e.clientX, e.clientY) && canMoveCrosshairs) {
        let boardRect = board.getBoundingClientRect();
        let gameAreaRect = gameArea.getBoundingClientRect();
        let crosshairRect = crosshairElement.getBoundingClientRect();
        let minX = boardRect.x - 64;
        let maxX = minX + boardRect.width + 64;
        let minY = -16;
        let maxY = gameAreaRect.y + gameAreaRect.height - crosshairRect.height + 16;
        crosshairElement.style.left = `${clamp(e.clientX - 65, minX, maxX)}px`;
        crosshairElement.style.top = `${clamp(e.clientY - 60, minY, maxY)}px`;
    }
});

window.addEventListener("click", function(e) {
    if (Ship.isBoardGenerated && started && IsInBoard(e.clientX, e.clientY)) {
        CheckTilesClick(e.clientX, e.clientY);
    }
});

function ShowShips() {
    for (let tileLoc of Ship.locToShipDict) {
        let tile = tiles[parseInt(tileLoc[0])];
        let ship = tileLoc[1].shipInstance;
        tile.classList.add(`tile-with-${ship.class}`);
        tile.style.backgroundPositionY = `-${tileSize * Ship.cssBackgroundPosMultiplierDict.get(ship.name.toLowerCase())}px`;
        if (tileLoc[1].section.isHit) {
            tile.style.backgroundPositionY = `${parseInt(tile.style.backgroundPositionY) - tileSize}px`
        }
    }
}

function GameOver(text) {
    canMoveCrosshairs = false;
    setTimeout(() => {
        ShowShips();
        setTimeout(() => {
            started = false;
            gameoverText.innerHTML = text;
            gameArea.classList.add("blurred");
            ShowElement(gameoverDialog);
        }, 750);
    }, 750);
}

function RestartGame() {
    HideElement(gameoverDialog);
    GenerateBoard();
    PlaceShips();
}

function Home() {
    for (let ship of currentDiff.ships) {
        ship.resetShip();
    }
    HideElement(gameoverDialog);
    HideElement(gameArea);
    ShowElement(titlePage);
}