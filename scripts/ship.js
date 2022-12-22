class Ship {
    constructor(length) {
        this.length = length;
        this.isSunk = false;
        this.isPlaced = false;
        this.sections = [];
        for (let i = 0; i < length; i++) {
            this.sections.push({ locId: "", isHit: false });
        }
    }

    static isShipHere = [];
    static boardSize;

    checkSunk() {
        tempIsSunk = true;
        for (let section of this.sections) {
            if (!section.isHit) {
                tempIsSunk = false;
            }
        }
        this.isSunk = tempIsSunk;
        return this.isSunk;
    }

    tryPlace() {

    }
}