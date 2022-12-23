class Ship {
    constructor(length, name, iconElement) {
        this.length = length;
        this.name = name;
        this.isSunk = false;
        this.isPlaced = false;
        this.sections = [];
        this.iconElement = iconElement;
        this.destroyedClass = name.toLowerCase() + "-icon-explosion";
        for (let i = 0; i < length; i++) {
            this.sections.push({ locId: "", isHit: false });
        }
    }

    static isShipHere = [];
    static boardSize;
    static isBoardGenerated = false;
    static idxStepForDirections = [];
    static locToShipDict = new Map();

    static createEmptyBoardList(boardSize) {
        Ship.boardSize = boardSize;
        for (let i = 0; i < Ship.boardSize**2; i++) {
            Ship.isShipHere.push(false);
        }
        Ship.idxStepForDirections = [1, -Ship.boardSize, -1, Ship.boardSize];
        Ship.locToShipDict = new Map();
        Ship.isBoardGenerated = true;
    }

    checkSunk() {
        let tempIsSunk = true;
        for (let section of this.sections) {
            if (!section.isHit) {
                tempIsSunk = false;
            }
        }

        if (tempIsSunk) {
            this.isSunk = true;
            this.iconElement.classList.add(this.destroyedClass);
        } else {
            this.isSunk = false;
        }
        return this.isSunk;
    }

    showIcon() {
        this.iconElement.classList.remove(this.destroyedClass);
        ShowElement(this.iconElement);
    }

    tryPlace() {
        if (Ship.isBoardGenerated) {
            // Get a starting location that does not already have a ship
            let startLocation = getRndInteger(0, Ship.boardSize**2);
            while (Ship.isShipHere[startLocation]) {
                startLocation = getRndInteger(0, Ship.boardSize**2);
            }

            let bestGuessesForDirection = [];
            // Check position relative to left side and if good add left as a good direction to try
            if ((startLocation - RoundDownToNearestMult(startLocation, Ship.boardSize) + 1) >= this.length) {
                bestGuessesForDirection.push(2);
            }
            // Check position relative to right side and if good add right as a good direction to try
            if ((RoundDownToNearestMult(startLocation + Ship.boardSize, Ship.boardSize) - startLocation) >= this.length) {
                bestGuessesForDirection.push(0);
            }
            // Check position relative to bottom and if good add down as a good direction to try
            if ((startLocation + (this.length - 1) * Ship.boardSize) < Ship.boardSize**2) {
                bestGuessesForDirection.push(3);
            }
            // Check position relative to top and if good add up as a good direction to try
            if ((startLocation - (this.length - 1) * Ship.boardSize) >= 0) {
                bestGuessesForDirection.push(1);
            }

            console.log(`Starting at ${startLocation}(Length ${this.length})...\nThe best guesses for direction are: ${bestGuessesForDirection}`);

            // Trying the directions from the best guesses to see if one works
            let goodPlacement = true;
            let numOfTries = bestGuessesForDirection.length;
            for (let i = 0; i < numOfTries; i++) {
                // Picking a random direction from the best guesses
                let rndDirIdx = getRndInteger(0, bestGuessesForDirection.length)
                let direction = bestGuessesForDirection[rndDirIdx];

                console.log(`Trying: ${direction}`)

                // Testing each location the ship will be in
                let currentIdx = startLocation;
                for (let j = 0; j < this.length; j++) {
                    if (Ship.isShipHere[currentIdx]) {
                        goodPlacement = false;
                    } else {
                        this.sections[j].locId = `${currentIdx}`;
                    }
                    currentIdx += Ship.idxStepForDirections[direction];
                }

                if (goodPlacement) {
                    break;
                } else {
                    for (let section of this.sections) {
                        section.locId = "";
                    }

                    bestGuessesForDirection.splice(rndDirIdx, 1);

                    console.log("Placement failed...\nTrying again");
                }
            }
            if (goodPlacement) {
                this.isPlaced = true;
                console.log("Placement was successful!\nPlaced at...");
                for (let section of this.sections) {
                    Ship.isShipHere[section.locId] = true;
                    Ship.locToShipDict.set(section.locId, { shipInstance: this, section: section });
                    console.log(`${section.locId}`);
                }

            } else {
                console.log("Placement failed completely\nStarting over...");
                this.tryPlace();
            }
        }
    }
}