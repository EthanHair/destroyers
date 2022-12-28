// Adding the css file
let link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href = "styling/snackbar.css";
document.head.appendChild(link);

// Adding the snackbar container
const snackbarContainer = document.createElement("div");
snackbarContainer.classList.add("snackbar-container");

function initializeSnackbars(textStyling) {
    snackbarContainer.classList.add(textStyling);
    document.body.appendChild(snackbarContainer);
}

function createSnackbar(text, severity = "info") {
    let snackbar = document.createElement("div");
    snackbar.classList.add("snackbar");
    if (severity) {
        snackbar.classList.add(severity);
    }
    snackbar.innerHTML = text;
    snackbar.addEventListener("click", () => {
        snackbar.remove();
    });
    return snackbar;
}

function showInfoSnackbar(text) {
    let infoSnackbar = createSnackbar(text, "info");
    snackbarContainer.appendChild(infoSnackbar);
    setTimeout(() => {
        infoSnackbar.remove();
    }, 3500);
}

function showSuccessSnackbar(text) {
    let successSnackbar = createSnackbar(text, "success");
    snackbarContainer.appendChild(successSnackbar);
    setTimeout(() => {
        successSnackbar.remove();
    }, 3500);
}

function showErrorSnackbar(text) {
    let errorSnackbar = createSnackbar(text, "error");
    snackbarContainer.appendChild(errorSnackbar);
    setTimeout(() => {
        errorSnackbar.remove();
    }, 3500);
}