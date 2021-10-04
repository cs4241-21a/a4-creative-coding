// window.onload = function() {
//  const data = [ 42,43,44,45 ]

//  d3.select( '#listing' )
//    .data( data )
//    .join( 'div' )
//      .text( datapoint => 'num: ' + datapoint )
//      .style( 'color', 'black' )
// }
var div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip-donut")
  .style("opacity", 0);

const TYPES = {
  Normal: true,
  Fighting: true,
  Flying: true,
  Poison: true,
  Ground: true,
  Rock: true,
  Bug: true,
  Ghost: true,
  Steel: true,
  Fire: true,
  Water: true,
  Grass: true,
  Electric: true,
  Psychic: true,
  Ice: true,
  Dragon: true,
  Fairy: true,
  Dark: true
};
const WEAKS = {
  Normal: true,
  Fighting: true,
  Flying: true,
  Poison: true,
  Ground: true,
  Rock: true,
  Bug: true,
  Ghost: true,
  Steel: true,
  Fire: true,
  Water: true,
  Grass: true,
  Electric: true,
  Psychic: true,
  Ice: true,
  Dragon: true,
  Fairy: true,
  Dark: true
};

const hei = {
  "Minimum Height": 0,
  "Maximum Height": 10
};
const wei = {
  "Minimum Weight": 0,
  "Maximum Weight": 500
};
const spaC = {
  "Minimum Spawn Chance": 0,
  "Maximum Spawn Chance": 1
};

let pokemon;
let sorter;
window.onload = function() {
  const tab = pane.addTab({
    pages: [{ title: "Filter" }, { title: "Sort" }]
  });
  const type = tab.pages[0].addFolder({
    title: "Type",
    expanded: false
  });

  type.addInput(TYPES, "Normal");
  type.addInput(TYPES, "Fighting");
  type.addInput(TYPES, "Flying");
  type.addInput(TYPES, "Poison");
  type.addInput(TYPES, "Ground");
  type.addInput(TYPES, "Rock");
  type.addInput(TYPES, "Bug");
  type.addInput(TYPES, "Ghost");
  type.addInput(TYPES, "Steel");
  type.addInput(TYPES, "Fire");
  type.addInput(TYPES, "Water");
  type.addInput(TYPES, "Grass");
  type.addInput(TYPES, "Electric");
  type.addInput(TYPES, "Psychic");
  type.addInput(TYPES, "Ice");
  type.addInput(TYPES, "Dragon");
  type.addInput(TYPES, "Fairy");
  type.addInput(TYPES, "Dark");
  const weakness = tab.pages[0].addFolder({
    title: "Weaknesses",
    expanded: false
  });

  weakness.addInput(WEAKS, "Normal");
  weakness.addInput(WEAKS, "Fighting");
  weakness.addInput(WEAKS, "Flying");
  weakness.addInput(WEAKS, "Poison");
  weakness.addInput(WEAKS, "Ground");
  weakness.addInput(WEAKS, "Rock");
  weakness.addInput(WEAKS, "Bug");
  weakness.addInput(WEAKS, "Ghost");
  weakness.addInput(WEAKS, "Steel");
  weakness.addInput(WEAKS, "Fire");
  weakness.addInput(WEAKS, "Water");
  weakness.addInput(WEAKS, "Grass");
  weakness.addInput(WEAKS, "Electric");
  weakness.addInput(WEAKS, "Psychic");
  weakness.addInput(WEAKS, "Ice");
  weakness.addInput(WEAKS, "Dragon");
  weakness.addInput(WEAKS, "Fairy");
  weakness.addInput(WEAKS, "Dark");

  tab.pages[0].addInput(hei, "Minimum Height", { min: 0, max: 10 });
  tab.pages[0].addInput(hei, "Maximum Height", { min: 0, max: 10 });
  tab.pages[0].addInput(wei, "Minimum Weight", { min: 0, max: 500 });
  tab.pages[0].addInput(wei, "Maximum Weight", { min: 0, max: 500 });
  tab.pages[0].addInput(spaC, "Minimum Spawn Chance", { min: 0, max: 1 });
  tab.pages[0].addInput(spaC, "Maximum Spawn Chance", { min: 0, max: 1 });
  const sortId = tab.pages[1].addButton({
    title: "Id"
  });
  sortId.on("click", () => {
    sorter = "id";
    updateSet();
  });
  const sortN = tab.pages[1].addButton({
    title: "Name"
  });
  sortN.on("click", () => {
    sorter = "name";
    updateSet();
  });
  const sortH = tab.pages[1].addButton({
    title: "Height"
  });
  sortH.on("click", () => {
    sorter = "height";
    updateSet();
  });
  const sortW = tab.pages[1].addButton({
    title: "Weight"
  });
  sortW.on("click", () => {
    sorter = "weight";
    updateSet();
  });
  const sortSC = tab.pages[1].addButton({
    title: "Spawn Chance"
  });
  sortSC.on("click", () => {
    sorter = "spawn_chance";
    updateSet();
  });
  fetch(
    "https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json"
  )
    .then(data => data.json())
    .then(data => (pokemon = data))
    .then(jsonData => {
      d3.select("listing")
        .data(d3.entries(jsonData.pokemon))
        .join("div")
        .filter(d => checkFilter(d))
        .sort((a, b) => handleSort(a, b))
        .text(
          d =>
            d.value.id +
            " : " +
            d.value.name +
            " | Type: " +
            d.value.type +
            " | Height: " +
            d.value.height +
            " | Weight: " +
            d.value.weight +
            " | Spawn Chance: " +
            d.value.spawn_chance
        )
        .style("background", d => getColorType(d.value.type[0]))
        .style("color", "black")
        .style("border-bottom", "1px gray solid")
        .style("font-family", "sans-serif")
        .attr("class", "pokelist")
        .on("mouseover", function(d, i) {
          d3.select(this)
            .transition()
            .duration("50")
            .style("opacity", ".5");
        })
        .on("mouseout", function(d, i) {
          d3.select(this)
            .transition()
            .duration("50")
            .style("opacity", "1");
        });
    });
};


function updateSet() {
  d3.selectAll(".pokelist").remove();

  d3.select("listing")
    .data(d3.entries(pokemon.pokemon))
    .join("div")
    .filter(d => checkFilter(d))
    .sort((a, b) => handleSort(a, b))
    .text(
      d =>
        d.value.id +
        " : " +
        d.value.name +
        " | Type: " +
        d.value.type +
        " | Height: " +
        d.value.height +
        " | Weight: " +
        d.value.weight +
        " | Spawn Chance: " +
        d.value.spawn_chance
    )
    .style("background", d => getColorType(d.value.type[0]))
    .style("color", "black")
    .style("border-bottom", "1px gray solid")
    .style("font-family", "sans-serif")
    .attr("class", "pokelist")
    .on("mouseover", function(d, i) {
      d3.select(this)
        .transition()
        .duration("50")
        .style("opacity", ".5");
    })
    .on("mouseout", function(d, i) {
      d3.select(this)
        .transition()
        .duration("50")
        .style("opacity", "1");
    });
}

function getColorType(color) {
  switch (color) {
    case "Normal":
      return "#A8A878";
    case "Fighting":
      return "#C03028";
    case "Flying":
      return "#A890F0";
    case "Poison":
      return "#A040A0";
    case "Ground":
      return "#E0C068";
    case "Rock":
      return "#B8A038";
    case "Bug":
      return "#A8B820";
    case "Ghost":
      return "#705898";
    case "Steel":
      return "#B8B8D0";
    case "Fire":
      return "#F08030";
    case "Water":
      return "#6890F0";
    case "Grass":
      return "#78C850";
    case "Electric":
      return "#F8D030";
    case "Psychic":
      return "#F85888";
    case "Ice":
      return "#98D8D8";
    case "Dragon":
      return "#7038F8";
    case "Fairy":
      return "#EE99AC";
    case "Dark":
      return "#705848";
  }
}

function checkFilter(d) {
  if (
    parseFloat(d.value.height) > hei["Maximum Height"] ||
    parseFloat(d.value.height) < hei["Minimum Height"]
  ) {
    return false;
  }
  if (
    parseFloat(d.value.weight) > wei["Maximum Weight"] ||
    parseFloat(d.value.weight) < wei["Minimum Weight"]
  ) {
    return false;
  }
  if (
    parseFloat(d.value.spawn_chance) > spaC["Maximum Spawn Chance"] ||
    parseFloat(d.value.spawn_chance) < spaC["Minimum Spawn Chance"]
  ) {
    return false;
  }
  let types = false;
  let weaks = false;
  d.value.type.forEach(element => {
    if (TYPES[element]) {
      types = true;
      return true;
    }
  });
  d.value.weaknesses.forEach(element => {
    if (WEAKS[element]) {
      weaks = true;
      return true;
    }
  });
  return types && weaks;
}

function handleSort(a, b) {
  switch (sorter) {
    case "id":
      return d3.ascending(a.value.id, b.value.id);
    case "name":
      return d3.ascending(a.value.name, b.value.name);
    case "height":
      return d3.ascending(a.value.height, b.value.height);
    case "weight":
      return d3.ascending(
        parseFloat(a.value.weight),
        parseFloat(b.value.weight)
      );
    case "spawn_chance":
      return d3.ascending(a.value.spawn_chance, b.value.spawn_chance);
  }
}
