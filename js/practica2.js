/**
 * practica2.js
 * 
 * Práctica 2 GPC: Dibujar el brazo de un robot a través de transformaciones, rotaciones y
 * modelos importados
 * 
 * @author <aiaseben@upv.es>, 2023
 * 
 */

// Modulos necesarios
import * as THREE from "../lib/three.module.js"
import {GLTFLoader} from "../lib/GLTFLoader.module.js"

// Variables consenso
let renderer, scene, camera;

// Otras variables globales
let angulo = 0;
let robot;

// Acciones
init();
loadScene();
render();

// Definición de funciones
function init()
{
    // Motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight); // para que ocupe toda la pantalla
    document.getElementById("container").appendChild( renderer.domElement);

    // Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.9,0.9,0.9);

    // Camara
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 5000);
    camera.position.set( 5,7,9 ); //
    camera.lookAt(0, 1, 0);
}

function loadScene()
{
    // Definir el material que se va a utilizar
    const material = new THREE.MeshBasicMaterial({color:'red', wireframe: true});

    // Base del robot
    const geoCilindro = new THREE.CylinderGeometry(5/3, 5/3, 1.5/3, 50, 1.5, false);

    // Brazo del robot
    const geoCilindro_brazo = new THREE.CylinderGeometry( 2/3, 2/3, 1.8/3, 50, 1.5, false);
    const geoEsfera = new THREE.SphereGeometry(2/3);
    const geoBox = new THREE.BoxGeometry(1.8/3, 12/3, 1.2/3);

    // Antebrazo del robot
    const geoCilindro_ante = new THREE.CylinderGeometry(2.2/3, 2.2/3, 0.6/3, 50, 1.5, false);
    const geoNervio1 = new THREE.BoxGeometry(0.4/3, 8/3, 0.4/3);
    const geoNervio2 = new THREE.BoxGeometry(0.4/3, 8/3, 0.4/3);
    const geoNervio3 = new THREE.BoxGeometry(0.4/3, 8/3, 0.4/3);
    const geoNervio4 = new THREE.BoxGeometry(0.4/3, 8/3, 0.4/3);
    const geoCilindro_mano = new THREE.CylinderGeometry(1.5/3, 1.5/3, 2, 50, 1.5, false);
    
    // Agarre con mano
    const geoAgarre = new THREE.BoxGeometry(2/3, 1.9/3, 0.4/3, 1, 1, 1);
    const geoAgarre2 = new THREE.BoxGeometry(2/3, 1.9/3, 0.4/3, 1, 1, 1);

    // Pirámide
        // Definir las dimensiones del trapecio
    const widthLarge = 2/3;    // Ancho del lado paralelo grande
    const height = 1.9/3;      // Altura
    const depth = 0.4/3;       // Profundidad

    // Calcular el ancho del lado paralelo pequeño
    const widthSmall = widthLarge / 2;

    // Crear la geometría del trapecio
    const boxGeometry = new THREE.BufferGeometry();
    const boxGeometry2 = boxGeometry;

    // Coordenadas de los vértices del trapecio
    const vertices = new Float32Array([
        // Cara frontal
        -widthLarge / 2, -height / 2, depth / 2,
        widthLarge / 2, -height / 2, depth / 2,
        widthSmall / 2,  height / 2, depth / 2,
        -widthSmall / 2,  height / 2, depth / 2,

        // Cara trasera
        -widthLarge / 2, -height / 2, -depth / 2,
        widthLarge / 2, -height / 2, -depth / 2,
        widthSmall / 2,  height / 2, -depth / 2,
        -widthSmall / 2,  height / 2, -depth / 2,

        // Caras laterales
        -widthLarge / 2, -height / 2, depth / 2,
        widthLarge / 2, -height / 2, depth / 2,
        widthLarge / 2, -height / 2, -depth / 2,
        -widthLarge / 2, -height / 2, -depth / 2,

        -widthSmall / 2, height / 2, depth / 2,
        widthSmall / 2, height / 2, depth / 2,
        widthSmall / 2, height / 2, -depth / 2,
        -widthSmall / 2, height / 2, -depth / 2,

        -widthLarge / 2, -height / 2, depth / 2,
        -widthSmall / 2, height / 2, depth / 2,
        -widthSmall / 2, height / 2, -depth / 2,
        -widthLarge / 2, -height / 2, -depth / 2,

        widthLarge / 2, -height / 2, depth / 2,
        widthSmall / 2, height / 2, depth / 2,
        widthSmall / 2, height / 2, -depth / 2,
        widthLarge / 2, -height / 2, -depth / 2
    ]);

    const vertices2 = vertices;

    boxGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    boxGeometry.computeVertexNormals();

    boxGeometry2.setAttribute('position', new THREE.BufferAttribute(vertices2, 3));
    boxGeometry2.computeVertexNormals();


    // Malla base
    const cilindro = new THREE.Mesh(geoCilindro, material);
    // Malla brazo
    const esfera = new THREE.Mesh(geoEsfera, material);
    const box = new THREE.Mesh(geoBox, material);
    const cilindro_b = new THREE.Mesh(geoCilindro_brazo, material);
    // Malla antebrazo
    const cilindro_ante = new THREE.Mesh(geoCilindro_ante, material);
    const nervio1 = new THREE.Mesh(geoNervio1, material);
    const nervio2 = new THREE.Mesh(geoNervio2, material);
    const nervio3 = new THREE.Mesh(geoNervio3, material);
    const nervio4 = new THREE.Mesh(geoNervio4, material);
    const cilindro_mano = new THREE.Mesh(geoCilindro_mano, material); 
    // Malla mano 
    const mano = new THREE.Mesh(geoAgarre, material);
    const cube = new THREE.Mesh(boxGeometry, material);
    const mano2 = new THREE.Mesh(geoAgarre2, material);
    const cube2 = new THREE.Mesh(boxGeometry2, material);


    // Robot 
    const robot = new THREE.Object3D();

    // Transformaciones de posición
    cilindro.position.set(0, 0, 0);
    robot.position.set(0, 0, 0);
    cilindro_b.position.set(0, 0, 0);
    

    //scene.add(robot);
    scene.add(cilindro);
    scene.add(cilindro_b);
    scene.add(box);
    scene.add(esfera);
    scene.add(cilindro_ante);
    cilindro_mano.add(mano);
    mano.add(cube);
    cilindro_mano.add(mano2);
    mano2.add(cube2);
    cilindro_ante.add(nervio1);
    cilindro_ante.add(nervio2);
    cilindro_ante.add(nervio3);
    cilindro_ante.add(nervio4);
    cilindro_ante.add(cilindro_mano);

    box.position.y = 2;
    esfera.position.y =12/3;
    cilindro_ante.position.y = 12/3;
    nervio1.position.set(-0.5, 1.5, 0);
    nervio2.position.set(0.5, 1.5, 0);
    nervio3.position.set(0, 1.5, 0.5);
    nervio4.position.set(0, 1.5, -0.5);
    cilindro_mano.position.y = 8/3;
    cilindro_mano.rotation.x = -Math.PI/2;
    mano.position.x = 0.3;
    mano.position.z = -0.3;
    cube.position.x = 0.6;
    mano2.position.x = 0.3;
    mano.position.z = 0.3;
    cube2.position.x = 0.6;
    cilindro_b.rotation.x = -Math.PI/2;
    cube.rotation.z = -Math.PI/2;
    mano.rotation.x = Math.PI/2;
    cube2.rotation.z = -Math.PI/2;
    mano2.rotation.x = Math.PI/2;
    

    // Definir un suelo
    const suelo = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000, 100, 100), new THREE.MeshBasicMaterial({color:'yellow', wireframe: true}));
    suelo.rotation.x = -Math.PI/2;
    scene.add(suelo);

    // Añadir ejes
    scene.add(new THREE.AxisHelper(1000));
}

function update()
{
    //angulo += 0.01;
    //robot.rotation.y = angulo;
}

function render()
{
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}

