"use strict";

let THREECAMERA = null;
let GLASSESOBJ3D = null

// callback: launched if a face is detected or lost.
function detect_callback(faceIndex, isDetected) {
  if (isDetected) {
    console.log('INFO in detect_callback(): DETECTED');
  } else {
    console.log('INFO in detect_callback(): LOST');
  }
}

// build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec) {
  const threeStuffs = THREE.JeelizHelper.init(spec, detect_callback);





const loaderBranches = new THREE.BufferGeometryLoader();
loaderBranches.load(
  './models/glasses/branches.json',
  (geometry) => {
    const mat = new THREE.MeshBasicMaterial({
      alphaMap: new THREE.TextureLoader().load('./models/glasses/alpha_branches.jpg'),
      map: new THREE.TextureLoader().load('./models/glasses/textureBlack.jpg'),
      transparent: true
    });

    const branchesMesh = new THREE.Mesh(geometry, mat);
    branchesMesh.scale.multiplyScalar(0.0067);
    branchesMesh.frustumCulled = false;
    branchesMesh.renderOrder = 10000;
    threeStuffs.faceObject.add(branchesMesh);
  }
);

const loaderDeco = new THREE.BufferGeometryLoader();

loaderDeco.load(
  './models/glasses/deco.json',
  (geometry) => {
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });

    const decoMesh = new THREE.Mesh(geometry, mat);
    decoMesh.scale.multiplyScalar(0.0067);
    
    decoMesh.frustumCulled = false;
    decoMesh.renderOrder = 10000;
    threeStuffs.faceObject.add(decoMesh);
  }
);
const loaderFrame = new THREE.BufferGeometryLoader();
loaderFrame.load(
  './models/glasses/frame.json',
  (geometry) => {
    const mat = new THREE.MeshPhongMaterial({
      color: 0x000000,
      shininess: 2,
      specular: 0xffffff,
      transparent: true
    });

    const frameMesh = new THREE.Mesh(geometry, mat);
    frameMesh.scale.multiplyScalar(0.0067);
    frameMesh.frustumCulled = false;
    frameMesh.renderOrder = 10000;
    threeStuffs.faceObject.add(frameMesh);
  }
);
const ambientLight = new THREE.AmbientLight(0XFFFFFF, 0.8);
threeStuffs.scene.add(ambientLight);
   // CREATE A CUBE
   /*
  const cubeGeometry = new THREE.BoxGeometry(1,1,1);
  const cubeMaterial = new THREE.MeshNormalMaterial();
  const threeCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  threeCube.frustumCulled = false;
  threeStuffs.faceObject.add(threeCube);*/

  //CREATE THE CAMERA
  THREECAMERA = THREE.JeelizHelper.create_camera();
} // end init_threeScene()

// launched by body.onload():
function main(){
  JeelizResizer.size_canvas({
    canvasId: 'jeeFaceFilterCanvas',
    callback: function(isError, bestVideoSettings){
      init_faceFilter(bestVideoSettings);
    }
  })
}

function init_faceFilter(videoSettings){
  JEEFACEFILTERAPI.init({
    followZRot: true,
    canvasId: 'jeeFaceFilterCanvas',
    NNCpath: './dist/', // root of NNC.json file
    maxFacesDetected: 1,
    callbackReady: function(errCode, spec){
      if (errCode){
        console.log('AN ERROR HAPPENS. ERR =', errCode);
        return;
      }

      console.log('INFO: JEEFACEFILTERAPI IS READY');
      init_threeScene(spec);
    },

    // called at each render iteration (drawing loop):
    callbackTrack: function(detectState){
      THREE.JeelizHelper.render(detectState, THREECAMERA);
    }
  }); //end JEEFACEFILTERAPI.init call
}

