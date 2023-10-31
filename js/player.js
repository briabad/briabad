import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124/build/three.module.js';

import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.124/examples/jsm/loaders/FBXLoader.js';


export const player = (() => {

  class Player {
    constructor(params) {
      // Crear una instancia de Vector3 para representar la posición inicial del jugador.
      this.position_ = new THREE.Vector3(0, 0, 0);
  
      // Inicializar la velocidad del jugador a 0.
      this.velocity_ = 0.0;
  
      // Crear un objeto Mesh (comentado) para representar visualmente al jugador.
      // El objeto Mesh es un cubo verde en este caso.
      // this.mesh_ = new THREE.Mesh(
      //     new THREE.BoxBufferGeometry(1, 1, 1),
      //     new THREE.MeshStandardMaterial({
      //         color: 0x80FF80, // Color del material
      //     }),
      // );
      // Habilitar la emisión y recepción de sombras para el objeto Mesh.
      // this.mesh_.castShadow = true;
      // this.mesh_.receiveShadow = true;
      // Agregar el objeto Mesh a la escena proporcionada en 'params'.
      // params.scene.add(this.mesh_);
  
      // Crear un objeto Box3 (caja delimitadora) que se utiliza para colisiones con el jugador.
      this.playerBox_ = new THREE.Box3();
  
      // Almacenar los parámetros pasados al constructor en una propiedad de la clase.
      this.params_ = params;
  
      // Llamar al método 'LoadModel_' para cargar el modelo 3D del jugador .
      this.LoadModel_();
  
      // Llamar al método 'InitInput_' para inicializar la detección de entrada del jugador.
      this.InitInput_();
    }
    LoadModel_() {
      // Crear un objeto loader de FBX que se utilizará para cargar y manipular objetos FBX.
      const loader = new FBXLoader();
    
      // Establecer la ruta donde se encuentran los archivos FBX de los personajes que pueden correr.
      loader.setPath('./js/resources/Dinosaurs/FBX/');
    
      // Cargar el archivo 'Velociraptor.fbx' y realizar acciones cuando se complete la carga.
      loader.load('Velociraptor.fbx', (fbx) => {
        // Escalar el modelo 3D para ajustarlo a la escena.
        fbx.scale.setScalar(0.0025);
    
        // Rotar el modelo 3D utilizando un cuaternión para orientarlo correctamente.
        fbx.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    
        // Almacenar el modelo cargado en la propiedad 'this.mesh_'.
//         La línea de código this.mesh_ = fbx; se utiliza para asignar el modelo 3D cargado (representado por la variable fbx) a la propiedad this.mesh_. En este contexto, this hace referencia a la instancia del objeto o clase en la que se encuentra este método (LoadModel_).
// La razón de asignar el modelo a this.mesh_ es permitir un fácil acceso y manipulación del modelo en otros métodos o partes del código dentro de la misma clase. 
        this.mesh_ = fbx;
    
        // Agregar el modelo a la escena definida en 'this.params_.scene'.
        this.params_.scene.add(this.mesh_);
    
        // Recorrer todos los componentes del modelo (traverse) para configurar propiedades y materiales.
        fbx.traverse(c => {
          let materials = c.material;
          if (!(c.material instanceof Array)) {
            materials = [c.material];
          }
    
          for (let m of materials) {
            if (m) {
              // Configurar el material para tener un color especular negro y un color difuso ligeramente alterado.
              m.specular = new THREE.Color(0x000000);
              m.color.offsetHSL(0, 0, 0.25);
            }
          }
    
          // Habilitar la sombra emitida y recibida por el componente del modelo.
          c.castShadow = true;
          c.receiveShadow = true;
        });
    
        // Crear un mezclador de animaciones para el modelo y almacenarlo en 'this.mixer_'.
        const m = new THREE.AnimationMixer(fbx);
        this.mixer_ = m;
    
        // Recorrer las animaciones del modelo y reproducir la animación que contiene 'Run' en el nombre.
        for (let i = 0; i < fbx.animations.length; ++i) {
          if (fbx.animations[i].name.includes('Run')) {
            const clip = fbx.animations[i];
            const action = this.mixer_.clipAction(clip);
            action.play();
          }
        }
      });
    }
    
/////////////////////////////////////////////////////////////////////////////////
    // anadir esuchador de eventos para la barra espaciadora
// Inicializa la detección de entrada del jugador, en este caso, se detecta la pulsación de la barra espaciadora.
InitInput_() {
  // Inicializa un objeto 'keys_' con una propiedad 'spacebar' que representa si la tecla de espacio está presionada.
  this.keys_ = {
      spacebar: false,
  };

  // Copia el estado inicial de 'keys_' en 'oldKeys' para llevar un registro de las teclas presionadas anteriormente.
  this.oldKeys = {...this.keys_};

  // Añade oyentes de eventos para las teclas de 'keydown' (pulsación) y 'keyup' (suelta).
  document.addEventListener('keydown', (e) => this.OnKeyDown_(e), false);
  document.addEventListener('keyup', (e) => this.OnKeyUp_(e), false);
}

// Función para manejar eventos cuando se presiona una tecla.
OnKeyDown_(event) {
  switch(event.keyCode) {
    case 32: // Código de tecla 32 representa la barra espaciadora.
      this.keys_.spacebar = true;
      break;
  }
}

// Función para manejar eventos cuando se suelta una tecla.
OnKeyUp_(event) {
  switch(event.keyCode) {
    case 32: // Código de tecla 32 representa la barra espaciadora.
      this.keys_.spacebar = false;
      break;
  }
}

// Función para comprobar colisiones entre el jugador y otros objetos en el mundo.
CheckCollisions_() {
  // Obtiene la lista de colisionadores del mundo proporcionado en 'params_'.
  const colliders = this.params_.world.GetColliders();

  // Establece una caja delimitadora (Box3) alrededor del jugador.
  this.playerBox_.setFromObject(this.mesh_);

  // Itera a través de los colisionadores y verifica si alguno de ellos se intersecta con la caja del jugador.
  for (let c of colliders) {
    const cur = c.collider;

    if (cur.intersectsBox(this.playerBox_)) {
      this.gameOver = true; // Si hay una colisión, establece la variable 'gameOver' como verdadera.
    }
  }
}

// Actualiza el estado del jugador en función del tiempo transcurrido.
Update(timeElapsed) {
  if (this.keys_.spacebar && this.position_.y === 0.0) {
    // Si la barra espaciadora está presionada y el jugador está en el suelo (y = 0), aplica una velocidad hacia arriba.
    this.velocity_ = 30;
  }

  const acceleration = -75 * timeElapsed;

  // Actualiza la posición vertical del jugador en función de la velocidad y la aceleración.
  this.position_.y += timeElapsed * (
      this.velocity_ + acceleration * 0.5);
  this.position_.y = Math.max(this.position_.y, 0.0); // Evita que la posición sea negativa.

  // Actualiza la velocidad del jugador en función de la aceleración.
  this.velocity_ += acceleration;
  this.velocity_ = Math.max(this.velocity_, -100); // Limita la velocidad mínima.

  if (this.mesh_) {
    // Si existe un objeto Mesh (modelo 3D), actualiza la animación y la posición del modelo, y verifica colisiones.
    this.mixer_.update(timeElapsed);
    this.mesh_.position.copy(this.position_);
    this.CheckCollisions_();
  }
}

  };

  return {
      Player: Player,
  };
})();