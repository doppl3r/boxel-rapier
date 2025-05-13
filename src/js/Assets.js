import { Audio, AudioListener, AudioLoader, EventDispatcher, LoadingManager, TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class Assets extends EventDispatcher {
  constructor() {
    // Inherit Three.js EventDispatcher system
    super();

    // Store assets in memory
    this.cache = {};
    
    // Define manager and assign callbacks
    this.manager = new LoadingManager();
    this.manager.onStart = (url, index, total) => this.dispatchEvent({ type: 'onStart', url, index, total });
    this.manager.onLoad = () => this.dispatchEvent({ type: 'onLoad' });
    this.manager.onProgress = (url, index, total) => this.dispatchEvent({ type: 'onProgress', url, index, total });
    this.manager.onError = url => this.dispatchEvent({ type: 'onError', url });
    
    // Initialize loaders with manager
    this.audioListener = new AudioListener();
    this.audioLoader = new AudioLoader(this.manager);
    this.modelLoader = new GLTFLoader(this.manager)
    this.textureLoader = new TextureLoader(this.manager);

    // Acceptable file types
    this.types = {
      audio: ['mp3', 'ogg', 'wav'],
      models: ['glb', 'gltf'],
      textures: ['jpg', 'jpeg', 'png']
    }
  }

  load(url) {
    // Get file details
    const fileType = url.substring(url.lastIndexOf('.') + 1);
    const fileName = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));

    // Assign loader by file type
    if (this.types.audio.includes(fileType)) {
      const audio = new Audio(this.audioListener);
      this.audioLoader.load(url, buffer => this.set(fileName, audio.setBuffer(buffer)));
    }
    else if (this.types.models.includes(fileType)) {
      this.modelLoader.load(url, gltf => this.set(fileName, gltf.scene));
    }
    else if (this.types.textures.includes(fileType)) {
      this.textureLoader.load(url, texture => this.set(fileName, texture));
    }
    else {
      console.error(`File type ".${ fileType }" not supported`)
    }
  }

  loadBatch(urls) {
    urls.forEach(path => this.load(path));
  }

  set(key, value) {
    return this.cache[key] = value;
  }

  get(key) {
    return this.cache[key];
  }
}

export { Assets }