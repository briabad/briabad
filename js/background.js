import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.122/build/three.module.js';

import {math} from './math.js';

import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.122/examples/jsm/loaders/GLTFLoader.js';
import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/FBXLoader.js';


export const background = (() => {

  class BackgroundCloud {
    constructor(params) {
      this.params_ = params;
      this.position_ = new THREE.Vector3();
      this.quaternion_ = new THREE.Quaternion();
      this.scale_ = 1.0;
      this.mesh_ = null;

      this.LoadModel_();
    }

    LoadModel_() {
      // Crear un objeto 'loader' de GLTFLoader para cargar modelos en formato GLTF/GLB.
      const loader = new GLTFLoader();
    
      // Establecer la ruta donde se encuentran los archivos GLB/GLTF de las nubes.
      loader.setPath('./js/resources/Clouds/GLTF/');
    
      // Cargar un archivo GLB de nube, con un número aleatorio entre 1 y 3 en el nombre.
      loader.load('Cloud' + math.rand_int(1, 3) + '.glb', (glb) => {
        // Asignar el modelo cargado (escena GLB) a la propiedad 'this.mesh_'.
        this.mesh_ = glb.scene;
    
        // Agregar el modelo a la escena definida en 'this.params_.scene'.
        this.params_.scene.add(this.mesh_);
    
        // Establecer posiciones y escalas aleatorias para la nube.
        this.position_.x = math.rand_range(0, 2000); // Posición en el eje X.
        this.position_.y = math.rand_range(100, 200); // Posición en el eje Y.
        this.position_.z = math.rand_range(500, -1000); // Posición en el eje Z.
        this.scale_ = math.rand_range(40, 20); // Escala del modelo tamano de la nube.
    
        // Crear un cuaternión (Quaternion) para rotar la nube aleatoriamente en el eje Y.
        const q = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0), math.rand_range(0, 360));
        this.quaternion_.copy(q);
    
        // Iterar a través de los componentes del modelo (traverse) para configurar materiales y sombras.
        this.mesh_.traverse(c => {
          if (c.geometry) {
            c.geometry.computeBoundingBox();
          }
    
          // Comprobar si el material es un arreglo y tratarlo como tal.
          let materials = c.material;
          if (!(c.material instanceof Array)) {
            materials = [c.material];
          }
    
          // Configurar materiales de los componentes del modelo.
          for (let m of materials) {
            if (m) {
              // Configurar el material para tener un color especular negro y un color de emisión gris.
              m.specular = new THREE.Color(0x000000);
              m.emissive = new THREE.Color(0xC0C0C0);
            }
          }
    
          // Habilitar la emisión y recepción de sombras por parte del componente.
          c.castShadow = true;
          c.receiveShadow = true;
        });
      });
    }
    

    Update(timeElapsed) {
      // Comprueba si no se ha cargado un modelo (this.mesh_ es nulo), y si es así, la función se detiene.
      if (!this.mesh_) {
        return;
      }
    
      // Mueve la nube hacia la izquierda en el eje X a una velocidad de 10 unidades por segundo.
      this.position_.x -= timeElapsed * 10;
    
      // Comprueba si la nube ha salido del límite izquierdo de la pantalla.
      if (this.position_.x < -100) {
        // Si la nube ha salido del límite, la reposiciona en una ubicación aleatoria en el rango (2000, 3000) en el eje X.
        this.position_.x = math.rand_range(2000, 3000);
      }
    
      // Copia la posición actual de la nube al modelo 3D, actualizando su posición en la escena.
      this.mesh_.position.copy(this.position_);
    
      // Copia la orientación (rotación) de la nube al modelo 3D, actualizando su orientación en la escena.
      this.mesh_.quaternion.copy(this.quaternion_);
    
      // Establece la escala del modelo 3D de la nube a la escala configurada previamente (this.scale_).
      this.mesh_.scale.setScalar(this.scale_);
    }
    
  };

  class BackgroundCrap {
    constructor(params) {
      // Establece los parámetros del objeto BackgroundCrap.
      this.params_ = params;
  
      // Inicializa las propiedades de posición, orientación y escala.
      this.position_ = new THREE.Vector3();
      this.quaternion_ = new THREE.Quaternion();
      this.scale_ = 1.0;
  
      // Inicializa el modelo de la clase como nulo.
      this.mesh_ = null;
  
      // Carga el modelo 3D de fondo.
      this.LoadModel_();
    }
  

   // Función para cargar un modelo 3D de fondo y configurar sus propiedades.
  LoadModel_() {
    // Define una lista de activos que incluye el nombre del archivo, el nombre de la textura y la escala para cada activo.
    const assets = [
      ['SmallPalmTree.glb', 'PalmTree.png', 3],
      ['BigPalmTree.glb', 'PalmTree.png', 5],
      ['Skull.glb', 'Ground.png', 1],
      // ['Scorpion.glb', 'Scorpion.png', 1],
      ['Pyramid.glb', 'Ground.png', 40],
      ['Monument.glb', 'Ground.png', 10],
      ['Cactus1.glb', 'Ground.png', 5],
      ['Cactus2.glb', 'Ground.png', 5],
      ['Cactus3.glb', 'Ground.png', 5],
    ];

    // Selecciona un activo aleatorio de la lista.
    const [asset, textureName, scale] = assets[math.rand_int(0, assets.length - 1)];

    // Carga la textura para el modelo de fondo.
    const texLoader = new THREE.TextureLoader();
    const texture = texLoader.load('./js/resources/DesertPack/Blend/Textures/' + textureName);
    texture.encoding = THREE.sRGBEncoding;

    // Crea un objeto 'loader' de GLTFLoader para cargar modelos GLB/GLTF.
    const loader = new GLTFLoader();

    // Establece la ruta donde se encuentran los archivos GLB/GLTF del fondo.
    loader.setPath('./js/resources/DesertPack/GLTF/');

    // Carga el activo seleccionado.
    loader.load(asset, (glb) => {
      // Asigna el modelo cargado a la propiedad 'this.mesh_'.
      this.mesh_ = glb.scene;

      // Agrega el modelo a la escena definida en 'this.params_.scene'.
      this.params_.scene.add(this.mesh_);

      // Establece la posición, escala y orientación del modelo de fondo de manera aleatoria.
      this.position_.x = math.rand_range(0, 2000);
      this.position_.z = math.rand_range(500, -1000);
      this.scale_ = scale;

      // Crea un cuaternión para rotar el modelo de fondo aleatoriamente en el eje Y.
      const q = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0), math.rand_range(0, 360));
      this.quaternion_.copy(q);

      // Itera a través de los componentes del modelo de fondo para configurar materiales y sombras.
      this.mesh_.traverse(c => {
        let materials = c.material;
        if (!(c.material instanceof Array)) {
          materials = [c.material];
        }

        for (let m of materials) {
          if (m) {
            // Configura la textura del material si existe.
            if (texture) {
              m.map = texture;
            }
            m.specular = new THREE.Color(0x000000);
          }
        }    
        c.castShadow = true;
        c.receiveShadow = true;
      });
    });
  }

  // Función de actualización que mueve y transforma el modelo de fondo.
  Update(timeElapsed) {
    // Comprueba si no se ha cargado un modelo (this.mesh_ es nulo), y si es así, la función se detiene.
    if (!this.mesh_) {
      return;
    }

    // Mueve el modelo de fondo hacia la izquierda en el eje X a una velocidad de 10 unidades por segundo.
    this.position_.x -= timeElapsed * 10;

    // Comprueba si el modelo de fondo ha salido del límite izquierdo de la pantalla.
    if (this.position_.x < -100) {
      // Si ha salido del límite, lo reposiciona en una ubicación aleatoria en el rango (2000, 3000) en el eje X.
      this.position_.x = math.rand_range(2000, 3000);
    }

    // Copia la posición actual, orientación y escala al modelo de fondo en la escena para actualizar su apariencia y posición.
    this.mesh_.position.copy(this.position_);
    this.mesh_.quaternion.copy(this.quaternion_);
    this.mesh_.scale.setScalar(this.scale_);
  }
};
class Background {
  constructor(params) {
    // Establece los parámetros del objeto Background.
    this.params_ = params;

    // Inicializa las listas de nubes y elementos de fondo (crap).
    this.clouds_ = [];
    this.crap_ = [];

    // Genera nubes y elementos de fondo al inicializar la instancia de la clase.
    this.SpawnClouds_();
    this.SpawnCrap_();
  }

  // Función para generar nubes en la escena.
  SpawnClouds_() {
    for (let i = 0; i < 25; ++i) {
      // Crea una instancia de la clase BackgroundCloud y la agrega a la lista de nubes.
      const cloud = new BackgroundCloud(this.params_);
      this.clouds_.push(cloud);
    }
  }

  // Función para generar elementos de fondo (crap) en la escena.
  SpawnCrap_() {
    for (let i = 0; i < 50; ++i) {
      // Crea una instancia de la clase BackgroundCrap y la agrega a la lista de elementos de fondo.
      const crap = new BackgroundCrap(this.params_);
      this.crap_.push(crap);
    }
  }

  // Función de actualización que llama a la función 'Update' de cada nube y elemento de fondo en la lista.
  Update(timeElapsed) {
    for (let c of this.clouds_) {
      c.Update(timeElapsed);
    }
    for (let c of this.crap_) {
      c.Update(timeElapsed);
    }
  }
}


  return {
      Background: Background,
  };
})();