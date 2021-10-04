const doctorsList = document.getElementById("doctors");
const doctorsForm = document.querySelector("form");

function appendNewDoctors(doctors) {
  const newListItem = document.createElement("li");
  newListItem.innerText = doctors;
  doctorsList.appendChild(newListItem);
}

fetch("/doctors")
  .then(response => response.json())
  .then(doctors => {
    doctorsList.firstElementChild.remove();

    doctors.forEach(appendNewDoctors);
    doctorsForm.addEventListener("submit", event => {
      event.preventDefault();
      let newDoc = doctorsForm.value;
      doctors.push(newDoc);
      appendNewDoctors(newDoc);
      doctorsForm.reset();
    });
  });

const PARAMS = {
  width: 0.5,
  height: 0.5,
  radius: 0.5,
  textcolor: "white"
};

const pane = new Tweakpane.Pane();

pane.addInput(PARAMS, "width", {
  step: 10,
  min: 0,
  max: 100
});
pane.addInput(PARAMS, "height", {
  step: 10,
  min: 0,
  max: 100
});
pane.addInput(PARAMS, "radius", {
  step: 10,
  min: 0,
  max: 100
});
pane.addInput(PARAMS, "textcolor", {
  options: {
    black: "80px serif",
    white: "80px sans-serif",
    surpise_me: "80px sans-serif"
  }
});
