window.onload = () => {
  structuring();
  main();
  sortByName();
  createMap();
};

window.onclick = function(event) {
  if (!event.target.matches('.trigger')) {
    var drop = document.getElementsByClassName("options");
    var i;
    for (i = 0; i < drop.length; i++) {
      var open = drop[i];
      if (open.classList.contains('show')) {
        open.classList.remove('show');
      }
    }
  }
}

function structuring() {
  const header = document.createElement("header");
  header.innerHTML = "Countries / Territories / Areas";
  header.setAttribute("class", "header");
  document.body.appendChild(header);

  const ui = document.createElement("div");
  ui.setAttribute("id", "ui");
  document.body.appendChild(ui);

  const sortbttn = document.createElement("div");
  sortbttn.setAttribute("id", "sort");
  sortbttn.innerHTML = '<button onclick="show_hide_sort()" id="sortby" class="trigger">Sort by</button><div id="sortbttnlist" class ="options"><button onclick="sortByName()" class="content"> Name </button>   <button onclick="sortByArea()" class="content"> Area </button>  <button onclick="sortByPopulation()" class="content"> Population </button>';
  ui.appendChild(sortbttn);

  const byregion = document.createElement("div");
  byregion.setAttribute("id", "region");
  byregion.innerHTML = '<button onclick="show_hide_region()" id="byregion" class="trigger">By Region</button><div id="regionlist" class ="options"><button onclick="byRegion(`All`)" class ="content"> All </button>   <button onclick="byRegion(`Africa`)" class ="content"> Africa </button>  <button onclick="byRegion(`Americas`)" class ="content"> Americas </button><button onclick="byRegion(`Asia`)" class ="content"> Asia </button><button onclick="byRegion(`Europe`)" class ="content"> Europe </button><button onclick="byRegion(`Oceania`)" class ="content"> Oceania </button><button onclick="byRegion(`Polar`)" class ="content"> Polar </button></div>';
  ui.appendChild(byregion);

  const searchbar = document.createElement("div");
  searchbar.setAttribute("id", "search");
  searchbar.innerHTML = "<input id= 'input' placeholder='Search name...' onkeypress='enter(event)'></input>";
  ui.appendChild(searchbar);

  const statusbar = document.createElement("div");
  statusbar.setAttribute("id", "status");
  const matchresult = document.createElement("div");
  matchresult.setAttribute("id", "matchresult");
  const sortandfilter = document.createElement("div");
  sortandfilter.setAttribute("id", "sortandfilter");
  sortandfilter.innerHTML = "<div id='showed'>SHOWED REGION: ALL</div><div id='ordered'>ORDERED BY: NAME</div>";
  ui.appendChild(statusbar);
  statusbar.appendChild(matchresult);
  statusbar.appendChild(sortandfilter);
  searchbarcross();

  const displayBlock = document.createElement("div");
  displayBlock.setAttribute("id", "displayBlock");
  document.body.appendChild(displayBlock);
}

async function main() {
  await fetch('https://restcountries.com/v2/all')
    .then(response => {
      if (response.status == 200) {
        response.json().then(data => {
          for (i = 0; i < data.length; i++) {
            buildBlocks(data[i]);
            createmapbttn(data[i], i);
          }
        });
      } else {
        console.log("no response");
      }
    })
    .catch(err => {
      console.log("err");
    });
}

function buildBlocks(i) {
  let para = [
    "name",
    "alpha3Code",
    "callingCodes",
    "subregion",
    "region",
    "population",
    "lat",
    "long",
    "area",
    "flag"
  ];
  var node = document.createElement("ul");
  node.setAttribute("class", "mainblocks filtered");
  node.setAttribute("id", i.name);
  if (i.name == "Åland Islands") {
    node.setAttribute("id", "Aland Islands");
  }
  displayBlock.appendChild(node);
  for (j = 0; j < para.length; j++) {
    var subNode = document.createElement("li");
    subNode.setAttribute("class", para[j]);
    try {
      if (para[j] == "callingCodes") {
        subNode.setAttribute("value", i.callingCodes[0]);
        subNode.innerHTML = "<strong>Calling Code: </strong>" + i.callingCodes[0];
      } else if (para[j] == "lat") {
        subNode.setAttribute("value", i.latlng[0]);
        subNode.innerHTML = "<strong>Latitude (degree): </strong>" + i.latlng[0];
      } else if (para[j] == "long") {
        subNode.setAttribute("value", i.latlng[1]);
        subNode.innerHTML = "<strong>Longtitude (degree): </strong>" + i.latlng[1];
      } else if (i[para[j]] == undefined) {
        subNode.setAttribute("value", "");
        subNode.innerHTML = "";
        if (para[j] == "area") {
          subNode.setAttribute("value", "0");
        }
      } else if (para[j] == "flag") {
        subNode.innerHTML = "<img src='" + i.flag + `' class="flags"/>`;
      } else if (para[j] == "alpha3Code") {
        subNode.setAttribute("value", i.alpha3Code);
        subNode.innerHTML = "<strong>Code: </strong>" + i.alpha3Code;
      } else if (para[j] == "name") {
        subNode.setAttribute("value", i.name);
        subNode.innerHTML = i.name;
        if (i.name == "Åland Islands") {
          subNode.setAttribute("value", "Aland Islands");
        }
      } else if (para[j] == "subregion") {
        subNode.setAttribute("value", i.subregion);
        subNode.innerHTML = "<strong>Subregion: </strong>" + i.subregion;
      } else if (para[j] == "region") {
        subNode.setAttribute("value", i.region);
        subNode.innerHTML = "<strong>Region: </strong>" + i.region;
      } else if (para[j] == "population") {
        subNode.setAttribute("value", i.population);
        subNode.innerHTML = "<strong>Population: </strong>" + i.population;
      } else if (para[j] == "area") {
        subNode.setAttribute("value", i.area);
        subNode.innerHTML = "<strong>Area <span> (km&#178)</span></strong>: " + i.area;
        if (i.area < 1) {
          subNode.setAttribute("value", 1);
        }
      }
    } catch (err) {
      subNode.innerHTML = "";
      if (para[j] == "area") {
        subNode.setAttribute("value", "0");
      }
    } finally {
      node.appendChild(subNode);
    }
  }
}

function leavesearch() {
  document.getElementById("region").style.display = "inline-block";
  document.getElementById("sort").style.display = "inline-block";
  document.getElementById("sortandfilter").style.display = "inline-block";
  document.getElementById("matchresult").style.display = "none";
  document.getElementById("cross").style.display = "none";
  document.getElementById("input").value = "";
  var original = document.getElementsByClassName("filtered");
  for (i = 0; i < original.length; i++) {
    original[i].setAttribute("style", "display: inline-block");
  }

}

function searchbarcross() {
  var cross = document.createElement("button");
  cross.setAttribute("id", "cross");
  cross.setAttribute("onclick", "leavesearch()");
  cross.setAttribute("style", "display: none");
  cross.innerHTML = "&#215";
  var searchbar = document.getElementById("search");
  searchbar.appendChild(cross);
}

function enter(key) {
  if (key.keyCode === 13) {
    document.getElementById("region").style.display = "none";
    document.getElementById("sort").style.display = "none";
    document.getElementById("sortandfilter").style.display = "none";
    document.getElementById("matchresult").style.display = "inline-block";
    document.getElementById("cross").style.display = "inline-block";
    var counter = 0;
    var searchobject = document.getElementById("input").value.toLowerCase();
    var blocks = document.getElementsByClassName("filtered");
    for (i = 0; i < blocks.length; i++) {
      var name = blocks[i].getAttribute("id").toLowerCase();
      if (name.indexOf(searchobject) >= 0) {
        blocks[i].setAttribute("style", "display: inline-block");
        counter += 1;
      } else {
        blocks[i].setAttribute("style", "display: none");
      }
    }
    searchresult("searching", counter);
  }
  return 0;
}

function searchresult(status, counter) {
  if (status == "searching") {
    if (counter == 1) {
      document.getElementById('matchresult').innerHTML = "SEARCH RESULT: 1 MATCH";
    } else {
      document.getElementById('matchresult').innerHTML = "SEARCH RESULT: " + counter + " MATCHES";
    }
  } else {
    sortandfilter();
  }
}

function orderedby(sort) {
  document.getElementById('ordered').innerHTML = "ORDERED BY: " + sort;
}

function showedby(region) {
  document.getElementById('showed').innerHTML = "SHOWED REGION: " + region.toUpperCase();
}

function createmapbttn(x, y) {
  var mapbttn = document.createElement("li");
  var addto = document.getElementById(x.name);
  if (x.name == "Åland Islands") {
    addto = document.getElementById("Aland Islands");
  }
  try {
    var lat = x.latlng[0];
    var long = x.latlng[1];
    var area = x.area;
    if (lat == undefined) {
      lat = 0;
    }
    if (long == undefined) {
      long = 0;
    }
    if (area == undefined) {
      area = 1;
    }
  } catch (err) {
    lat = 0;
    long = 0;
    area = 1;
  }
  mapbttn.setAttribute("id", y);
  mapbttn.setAttribute("class", "mapbttnli");
  var output =
    mapbttn.innerHTML = '<button onclick="mapbttn(' + lat + ',' + long + ',' + area + ')" class="mapbttn">Map</button>';
  addto.appendChild(mapbttn);
  if (lat == 0 && long == 0 && area == 1) {
    mapbttn.innerHTML = "";
  }
}

function show_hide_region() {
  document.getElementById("regionlist").classList.toggle("show");
}

function show_hide_sort() {

  document.getElementById("sortbttnlist").classList.toggle("show");

}

function sortByName() {
  var list = document.getElementsByClassName("mainblocks");
  list = Array.prototype.slice.call(list);
  list.sort(function(x, y) {
    if (x.getAttribute("id") < y.getAttribute("id")) {
      return -1;
    }
    if (x.getAttribute("id") > y.getAttribute("id")) {
      return 1;
    }
    return 0;
  })
  var displayBlock = document.getElementById("displayBlock");
  displayBlock.innerHTML = "";
  for (var i = 0; i < list.length; i++) {
    displayBlock.appendChild(list[i]);
  }
  orderedby("NAME");
}

function sortByArea() {
  var list = document.getElementsByClassName("mainblocks");
  list = Array.prototype.slice.call(list, 0);
  list.sort(function(x, y) {
    var xorder = +x.querySelector(".area").value;
    var yorder = +y.querySelector(".area").value;
    return (xorder < yorder) ? 1 : -1;
  });
  var displayBlock = document.getElementById("displayBlock");
  displayBlock.innerHTML = "";
  for (var i = 0; i < list.length; i++) {
    displayBlock.appendChild(list[i]);
  }
  orderedby("AREA");
}

function byRegion(region) {
  var blocks = document.getElementsByClassName("region");
  for (i = 0; i < blocks.length; i++) {
    if (region == "All") {
      blocks[i].parentNode.setAttribute("style", "display: inline-block;");
      blocks[i].parentNode.classList.add("filtered");
    } else if (blocks[i].getAttribute('value') != region) {
      blocks[i].parentNode.setAttribute("style", "display: none;");
      blocks[i].parentNode.classList.remove("filtered");
    } else {
      blocks[i].parentNode.setAttribute("style", "display: inline-block;");
      blocks[i].parentNode.classList.add("filtered");
    }
  }
  showedby(region);
}

function sortByPopulation() {
  var list = document.getElementsByClassName("mainblocks");
  list = Array.prototype.slice.call(list, 0);
  list.sort(function(x, y) {
    var xorder = +x.querySelector(".population").value;
    var yorder = +y.querySelector(".population").value;
    return (xorder < yorder) ? 1 : -1;
  });
  var displayBlock = document.getElementById("displayBlock");
  displayBlock.innerHTML = "";
  for (var i = 0; i < list.length; i++) {
    displayBlock.appendChild(list[i]);
  }
  orderedby("POPULATION");
}

function mapbttn(lat, long, area) {

  showMap();
  var map = new ol.Map({
    target: 'mapView',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([long, lat]),
      zoom: 11 - (Math.log10(area / (16 - Math.log10(area))))
    })
  });
  var close = document.getElementById("closebttn");
  close.addEventListener('click', hideMap);
}

function createMap() {
  var map = document.createElement("div");
  map.setAttribute("id", "mapView");
  document.body.appendChild(map);
  var close = document.createElement("button");
  close.setAttribute("id", "closebttn");
  close.innerHTML = "Close";
  map.appendChild(close);
  map.style.display = "none";
}

function showMap() {
  var map = document.getElementById("mapView");
  console.log()
  map.style.display = "block";
  var rem = document.querySelector(".ol-viewport");
  try {
    rem.remove();
  } catch (err) {}
}

function hideMap() {
  var map = document.getElementById("mapView");
  map.style.display = "none";
  var rem = document.querySelector(".ol-viewport");
  try {
    rem.remove();
  } catch (err) {}
}