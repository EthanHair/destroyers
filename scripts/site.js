// Getting the elements
//#region



//#endregion

// Properties
//#region



//#endregion

// General functions

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function RoundDownToNearestMult(number, mult) {
    let quo = Math.floor(number/mult);
    let multipleOfMult = mult * quo;
    return multipleOfMult;
}

function ShowElement(element) {
    if (element.classList.contains("d-none"))
    {
        element.classList.remove("d-none");
    }
}

function HideElement(element) {
    if (!element.classList.contains("d-none"))
    {
        element.classList.add("d-none");
    }
}