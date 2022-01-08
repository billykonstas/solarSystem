//import './style.css'

import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';

import {OrbitControls} from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js';

import {OBJLoader} from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/OBJLoader.js';

import {MTLLoader} from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/MTLLoader.js';
import { LoadingManager, MathUtils, Vector3 } from 'https://unpkg.com/three@0.127.0/build/three.module.js';

//import { GUI } from 'three/examples/jsm/libs/dat.gui.module';

import { EffectComposer } from 'https://unpkg.com/three@0.127.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.127.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass} from 'https://unpkg.com/three@0.127.0/examples/jsm/postprocessing/UnrealBloomPass.js';
//import { TextGeometry } from 'https://unpkg.com/three@0.127.0/examples/jsm/geometries/TextGeometry.js';
//import { FontLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/FontLoader.js';

//LoadingScreen
var RESOURCES_LOADED = false;

var loadingManager = new THREE.LoadingManager( () => {
		const loadingScreen = document.getElementById( 'planet' );
}
);

//camera, renderer, controls
const canvasContainer = document.querySelector('#canvasContainer');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, canvasContainer.offsetWidth / canvasContainer.offsetHeight, 0.1, 1000);

const renderer = new THREE.WebGL1Renderer(
  {
    canvas: document.querySelector('#planetCanvas'),
    antialias: true
  }
);

renderer.setPixelRatio(canvasContainer.devicePixelRatio);
renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
camera.position.set(2, 1, 6);
renderer.render(scene, camera);

const controls = new OrbitControls( camera, renderer.domElement);

//lights
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);
const pointLightFront = new THREE.PointLight(0xffffff, 0.7);
pointLightFront.position.set(0,0,80);
const pointLightBack = new THREE.PointLight(0xffffff, 0.7);
pointLightBack.position.set(0,0,-80);
const pointLightRight = new THREE.PointLight(0xffffff, 0.7);
pointLightRight.position.set(80,0,0);
const pointLightLeft = new THREE.PointLight(0xffffff, 0.7);
pointLightLeft.position.set(-80,0,0);
const pointLightTop = new THREE.PointLight(0xffffff, 0.7);
pointLightTop.position.set(0,80,0);
const pointLightBottom = new THREE.PointLight(0xffffff, 0.7);
pointLightBottom.position.set(0,-80,0);
//scene.add(pointLightFront, pointLightBack, pointLightRight, pointLightLeft, pointLightTop, pointLightBottom);

//background
const spaceTexture = new THREE.TextureLoader().load('./img/space.jpg');
scene.background = spaceTexture;
const myPlanetName = localStorage.getItem('selectedPlanet');

//HTML content
var title = document.getElementById('planetName');
var information = document.getElementById('planetInfo');
//Planets

generateInfo(myPlanetName);

var planetMaterial = new THREE.MeshPhongMaterial(
    {
        map : new THREE.TextureLoader().load('./img/earth.jpg'),
        bumpMap: new THREE.TextureLoader().load('./img/earth_bump.jpg'),
        bumpScale: 0.8,
        specularMap: new THREE.TextureLoader().load('./img/earth_specular.jpg'),
        //specular: new THREE.Color('blue'),
        shininess: 1,
        reflectivity: 0.2
    }
);
var planetGeometry = new THREE.SphereGeometry(2, 64, 32);
var planet = new THREE.Mesh(planetGeometry,planetMaterial);


//Clouds
var cloudMesh = new THREE.Mesh(
    new THREE.SphereGeometry(2.03, 24, 24),
    new THREE.MeshPhongMaterial({
        map         : new THREE.TextureLoader().load('./img/clouds.png'),
        opacity     : 0.4,
        transparent : true,
    })
);

//Moon 
var moon = new THREE.Mesh (
  new THREE.SphereGeometry(0.5, 64, 24),
  new THREE.MeshPhongMaterial(
    {
      map : new THREE.TextureLoader(loadingManager).load('./img/moon.jpg'),
      normalMap: new THREE.TextureLoader().load('./img/moon_normal.jpg'),
      shininess: 1,
      reflectivity: 0.02
    }
  )
);

moon.position.set(2.8, 0.6, 0);

//Saturn's Ring
const saturnTexture = new THREE.TextureLoader().load('./img/saturn_ring.png');
saturnTexture.rotation = 90 * Math.PI / 180;
//const saturnAlpha = new THREE.TextureLoader().load('./img/saturn_alpha.gif');
//saturnAlpha.rotation = 90 * Math.PI / 180;

const saturnRing = new THREE.Mesh (
  new THREE.TorusGeometry( 2.5, 0.4, 2, 200),
  new THREE.MeshPhongMaterial(
    {
      map: saturnTexture
    }
  )
);
saturnRing.rotation.x = 270 * Math.PI / 180;

if (myPlanetName == 'Earth')
{
    console.log('Found Earth!');
    planet.add(cloudMesh);
    planet.add(moon);
}
else if (myPlanetName == 'Sun')
{
    console.log('Found Sun!');
    var sunMaterial = new THREE.MeshPhongMaterial(
        {
          map : new THREE.TextureLoader().load('./img/sun.jpg'),
          normalMap: new THREE.TextureLoader().load('./img/sun_normal.jpg'),
          shininess: 1,
          reflectivity: 0.02
        });
    planetMaterial = sunMaterial;
    planet = new THREE.Mesh(planetGeometry,planetMaterial);
    }
else if (myPlanetName == 'Mercury')
{
    console.log('Found Mercury!');
    var mercuryMaterial = new THREE.MeshPhongMaterial(
            {
              map : new THREE.TextureLoader().load('./img/mercury.jpg'),
              normalMap: new THREE.TextureLoader().load('./img/mercury_normal.png'),
              shininess: 1,
            reflectivity: 0.02
            }
    );
    planetMaterial = mercuryMaterial;
    planet = new THREE.Mesh(planetGeometry,planetMaterial);
}
else if (myPlanetName == 'Venus')
{
    console.log('Found Venus!');
    var venusMaterial = new THREE.MeshPhongMaterial(
            {
              map : new THREE.TextureLoader().load('./img/venus.jpg'),
              normalMap: new THREE.TextureLoader().load('./img/venus_normal.png'),
              shininess: 1,
            reflectivity: 0.02
            }
    );
    planetMaterial = venusMaterial;
    planet = new THREE.Mesh(planetGeometry,planetMaterial);
}
else if (myPlanetName == 'Mars')
{
    console.log('Found Mars!');
    var marsMaterial = new THREE.MeshPhongMaterial(
            {
            map : new THREE.TextureLoader().load('./img/mars.jpg'),
            normalMap: new THREE.TextureLoader().load('./img/mars_normal.jpg'),
            shininess: 1,
            reflectivity: 0.02
            }
    );
    planetMaterial = marsMaterial;
    planet = new THREE.Mesh(planetGeometry,planetMaterial);
}
else if (myPlanetName == 'Jupiter')
{
    console.log('Found Jupiter!');
    var jupiterMaterial = new THREE.MeshPhongMaterial(
            {
              map : new THREE.TextureLoader().load('./img/jupiter.jpg'),
              shininess: 1,
              reflectivity: 0.02
            }
    );
    planetMaterial = jupiterMaterial;
    planet = new THREE.Mesh(planetGeometry,planetMaterial);
}
else if (myPlanetName == 'Saturn with Ring')
{
    console.log('Found Saturn!');
    var saturnMaterial = new THREE.MeshPhongMaterial(
            {
              map : new THREE.TextureLoader().load('./img/saturn.jpg'),
              shininess: 1,
              reflectivity: 0.02
            }
    );
    planetMaterial = saturnMaterial;
    planet = new THREE.Mesh(planetGeometry,planetMaterial);
    scene.add(saturnRing);
}
else if (myPlanetName == 'Uranus')
{
    console.log('Found Uranus!');
    var uranusMaterial = new THREE.MeshPhongMaterial(
            {
              map : new THREE.TextureLoader().load('./img/uranus.jpg'),
              shininess: 4,
              reflectivity: 0.1
            }
    );
    planetMaterial = uranusMaterial;
    planet = new THREE.Mesh(planetGeometry,planetMaterial);
}
else if (myPlanetName == 'Neptune')
{
    console.log('Found Neptune!');
    var neptuneMaterial = new THREE.MeshPhongMaterial(
            {
              map : new THREE.TextureLoader().load('./img/neptune.jpg'),
              shininess: 1,
              reflectivity: 0.02
            }
    );
    planetMaterial = neptuneMaterial;
    planet = new THREE.Mesh(planetGeometry,planetMaterial);
}

scene.add(planet);
animate();

function animate() {
    requestAnimationFrame(animate);

    planet.rotation.y += 0.004;
    moon.rotation.y += 0.009;
    cloudMesh.rotation.y += 0.008;
    saturnRing.rotation.z -= 0.004;
    renderer.render(scene, camera);
}

//loadingManager
loadingManager.onLoad = function () {
    console.log('All resources Loaded.');
    RESOURCES_LOADED = true;
  }

function generateInfo(planetName)
{
  title.innerHTML=planetName;
  if (planetName == 'Sun')
  {
    information.innerHTML = ' The Sun is a 4.5 billion-year-old star – a hot glowing ball of hydrogen and helium at the center of our solar system. It is about 93 million miles (150 million kilometers) from Earth, and without its energy, life as we know it could not exist here on our home planet.<br><br>The Sun is the largest object in our solar system. The Sun’s volume would need 1.3 million Earths to fill it. Its gravity holds the solar system together, keeping everything from the biggest planets to the smallest bits of debris in orbit around it. The hottest part of the Sun is its core, where temperatures top 27 million degrees Fahrenheit (15 million degrees Celsius).<br><br> The Sun’s activity, from its powerful eruptions to the steady stream of charged particles it sends out, influences the nature of space throughout the solar system. NASA and other international space agencies monitor the Sun 24/7 with a fleet of spacecraft, studying everything from its atmosphere to its surface, and even peering inside the Sun using special instruments.';
  }
  else if (planetName == 'Mercury')
  {
    information.innerHTML = "The smallest planet in our solar system and nearest to the Sun, Mercury is only slightly larger than Earth's Moon.<br><br>From the surface of Mercury, the Sun would appear more than three times as large as it does when viewed from Earth, and the sunlight would be as much as seven times brighter. Despite its proximity to the Sun, Mercury is not the hottest planet in our solar system – that title belongs to nearby Venus, thanks to its dense atmosphere.<br><br>Because of Mercury's elliptical – egg-shaped – orbit, and sluggish rotation, the Sun appears to rise briefly, set, and rise again from some parts of the planet's surface. The same thing happens in reverse at sunset.";
  }
  else if (planetName == 'Venus')
  {
    information.innerHTML = "Venus is the second planet from the Sun and is Earth’s closest planetary neighbor. It’s one of the four inner, terrestrial (or rocky) planets, and it’s often called Earth’s twin because it’s similar in size and density. These are not identical twins, however – there are radical differences between the two worlds.<br><br>Venus has a thick, toxic atmosphere filled with carbon dioxide and it’s perpetually shrouded in thick, yellowish clouds of sulfuric acid that trap heat, causing a runaway greenhouse effect. It’s the hottest planet in our solar system, even though Mercury is closer to the Sun. Surface temperatures on Venus are about 900 degrees Fahrenheit (475 degrees Celsius) – hot enough to melt lead. The surface is a rusty color and it’s peppered with intensely crunched mountains and thousands of large volcanoes. Scientists think it’s possible some volcanoes are still active.<br><br>Venus has crushing air pressure at its surface – more than 90 times that of Earth – similar to the pressure you'd encounter a mile below the ocean on Earth.";
  }
  else if (planetName == 'Earth')
  {
    information.innerHTML = "Earth is the third planet from the Sun, and the only place we know of so far that’s inhabited by living things.<br><br>While Earth is only the fifth largest planet in the solar system, it is the only world in our solar system with liquid water on the surface. Just slightly larger than nearby Venus, Earth is the biggest of the four planets closest to the Sun, all of which are made of rock and metal.<br><br>The name Earth is at least 1,000 years old. All of the planets, except for Earth, were named after Greek and Roman gods and goddesses. However, the name Earth is a Germanic word, which simply means “the ground.”";
  }
  else if (planetName == 'Mars')
  {
    information.innerHTML = "Mars is the fourth planet from the Sun – a dusty, cold, desert world with a very thin atmosphere. Mars is also a dynamic planet with seasons, polar ice caps, canyons, extinct volcanoes, and evidence that it was even more active in the past.<br><br>Mars is one of the most explored bodies in our solar system, and it's the only planet where we've sent rovers to roam the alien landscape.<br><br>NASA currently has two rovers (Curiosity and Perseverance), one lander (InSight), and one helicopter (Ingenuity) exploring the surface of Mars.";
  }
  else if (planetName == 'Jupiter')
  {
    information.innerHTML = "Jupiter has a long history of surprising scientists – all the way back to 1610 when Galileo Galilei found the first moons beyond Earth. That discovery changed the way we see the universe.<br><br>Fifth in line from the Sun, Jupiter is, by far, the largest planet in the solar system – more than twice as massive as all the other planets combined.<br><br>Jupiter's familiar stripes and swirls are actually cold, windy clouds of ammonia and water, floating in an atmosphere of hydrogen and helium. Jupiter’s iconic Great Red Spot is a giant storm bigger than Earth that has raged for hundreds of years.<br><br>One spacecraft – NASA's Juno orbiter – is currently exploring this giant world.";
  }
  else if (planetName == 'Saturn with Ring')
  {
    title.innerHTML='Saturn';
    information.innerHTML = "Saturn is the sixth planet from the Sun and the second-largest planet in our solar system.<br><br>Adorned with thousands of beautiful ringlets, Saturn is unique among the planets. It is not the only planet to have rings – made of chunks of ice and rock – but none are as spectacular or as complicated as Saturn's.<br><br>Like fellow gas giant Jupiter, Saturn is a massive ball made mostly of hydrogen and helium.";
  }
  else if (planetName == 'Uranus')
  {
    information.innerHTML = "Uranus is the seventh planet from the Sun, and has the third-largest diameter in our solar system. It was the first planet found with the aid of a telescope, Uranus was discovered in 1781 by astronomer William Herschel, although he originally thought it was either a comet or a star.<br><br>It was two years later that the object was universally accepted as a new planet, in part because of observations by astronomer Johann Elert Bode. Herschel tried unsuccessfully to name his discovery Georgium Sidus after King George III. Instead, the scientific community accepted Bode's suggestion to name it Uranus, the Greek god of the sky, as suggested by Bode.​";
  }
  else if (planetName == 'Neptune')
  {
    information.innerHTML = "Dark, cold, and whipped by supersonic winds, ice giant Neptune is the eighth and most distant planet in our solar system.<br><br>More than 30 times as far from the Sun as Earth, Neptune is the only planet in our solar system not visible to the naked eye and the first predicted by mathematics before its discovery. In 2011 Neptune completed its first 165-year orbit since its discovery in 1846.<br><br>NASA's Voyager 2 is the only spacecraft to have visited Neptune up close. It flew past in 1989 on its way out of the solar system."
  }
  else
  {
    title.innerHTML='The void';
    information.innerHTML = "Complete nothingness.";
    planet.visible = false;
  }

}
