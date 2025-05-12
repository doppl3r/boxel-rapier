import { AudioListener, AudioLoader, TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class Assets {
  constructor() {
    // Store assets in memory
    this.cache = {};
    
    // Define components
    this.audioListener = new AudioListener();
    this.audioLoader = new AudioLoader();
    this.modelLoader = new GLTFLoader()
    this.textureLoader = new TextureLoader();

    // Acceptable file types
    this.types = {
      audio: ['mp3', 'ogg', 'wav'],
      models: ['glb', 'gltf'],
      textures: ['jpg', 'jpeg', 'png']
    }
  }

  load(url, callback = e => e) {
    // Get file details
    const fileType = url.substring(url.lastIndexOf('.') + 1);
    const fileName = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));

    // Load asset using file type
    if (this.types.audio.includes(fileType)) {
      this.audioLoader.load(url, data => this.set(fileName, data, callback));
    }
    else if (this.types.models.includes(fileType)) {
      this.modelLoader.load(url, data => this.set(fileName, data, callback));
    }
    else if (this.types.textures.includes(fileType)) {
      this.textureLoader.load(url, data => this.set(fileName, data, callback));
    }
  }

  set(key, value, callback = () => {}) {
    this.cache[key] = value;
    callback(value);
  }
}

export { Assets }