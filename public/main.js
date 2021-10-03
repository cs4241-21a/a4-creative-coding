import {buildGUI} from "./UI/gui.js";
buildGUI();

const modal = document.getElementById("instructionsBox");
const span = document.getElementsByClassName("close")[0];
modal.style.display = "flex";
span.onclick = function() {
    modal.style.display = "none";
};
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};