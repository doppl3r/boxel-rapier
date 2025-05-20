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
    this.manager.onError = url => console.error(`File "${ url }" not found`);
    
    // Initialize loaders with manager
    this.audioListener = new AudioListener();
    this.audioLoader = new AudioLoader(this.manager);
    this.gltfLoader = new GLTFLoader(this.manager)
    this.textureLoader = new TextureLoader(this.manager);

    // Acceptable file types
    this.types = {
      audio: ['mp3', 'ogg', 'wav'],
      models: ['glb', 'gltf'],
      textures: ['jpg', 'jpeg', 'png']
    }
  }

  load(url, onLoad) {
    // Get file details
    const fileType = url.substring(url.lastIndexOf('.') + 1);
    const fileName = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));

    // Prevent duplicates
    if (this.get(fileName) === undefined) this.set(fileName, {});
    else return;

    // Conditionally load file types
    if (this.types.audio.includes(fileType)) {
      // Load Audio type
      const audio = new Audio(this.audioListener);
      this.set(fileName, audio);
      this.audioLoader.load(url, buffer => {
        this.set(fileName, audio.setBuffer(buffer))
        if (onLoad) onLoad(audio);
      });
    }
    else if (this.types.models.includes(fileType)) {
      // Load GLTF type
      this.gltfLoader.load(url, gltf => {
        this.set(fileName, gltf.scene)
        if (onLoad) onLoad(gltf.scene);
      });
    }
    else if (this.types.textures.includes(fileType)) {
      // Load Texture type
      this.textureLoader.load(url, texture => {
        this.set(fileName, texture)
        if (onLoad) onLoad(texture);
      });
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

  remove(key) {
    delete this.cache[key];
  }
}

export { Assets }