var res = {
    sol:"res/sol.png",
    sun:"res/sun.png",
    mercury:"res/mercury.png",
    mercuryUI:"res/mercuryUI.png",
    venus:"res/venus.png",
    venusUI:"res/venusUI.png",
    earth:"res/earth.png",
    earthUI:"res/earthUI.png",
    earthLoop:"res/earthLoop.jpg",
    mars:"res/mars.png",
    marsUI:"res/marsUI.png",
    jupiter:"res/jupiter.png",
    jupiterUI:"res/jupiterUI.png",
    saturn:"res/saturn.png",
    saturnUI:"res/saturnUI.png",
    saturnRing:"res/saturnRing.png",
    uranus:"res/uranus.png",
    uranusUI:"res/uranusUI.png",
    neptune:"res/neptune.png",
    neptuneUI:"res/neptuneUI.png",
    pluto:"res/pluto.png",
    plutoUI:"res/plutoUI.png",
    shadow:"res/shadow.png",
    asteroids:"res/AsteroidBelt.plist",
    ships:"res/ships.plist",
    asteroidsUI:"res/asteroidsUI.png",
    arrow:"res/arrow.png",
    explosion:"res/exploring.jpg",
    nutfall:"res/nutfall.mp3",

    terraforming:"res/terraforming.png",
    terraforming1:"res/terraforming1.png",

    mining:"res/mining.png",
    mining1:"res/mining1.png",

    propulsion:"res/propulsion.png",
    propulsion1:"res/propulsion1.png",

    spaceShip:"res/spaceShip.png",
    spaceShip1:"res/spaceShip1.png",

    production:"res/production.png",
    production1:"res/production1.png",

    infrastructure:"res/infrastructure.png",

    lvl0:"res/lvl0.png",
    lvl1:"res/lvl1.png",
    lvl2:"res/lvl2.png",
    lvl3:"res/lvl3.png",

    background:"res/back6.jpg",
    displayFont:{
        type:"font",
        name:"Di",
        srcs:["res/DisplayOTF.ttf"]
    }

};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}