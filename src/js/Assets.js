import { Audio, AudioListener, AudioLoader, EventDispatcher, LoadingManager, TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class Assets extends EventDispatcher {
  constructor() {
    // Inherit Three.js EventDispatcher system
    super();

    // Store assets in memory
    this.cache = {};
    this.queue = [];
    
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

  load(url, callback = a => a) {
    // Get file details
    const fileType = url.substring(url.lastIndexOf('.') + 1);
    const fileName = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    const queued = this.queue.find(item => item.name === fileName) !== undefined;
    const asset = this.get(fileName); // Default = undefined

    // Add item to the queue
    if (asset === undefined) {
      this.queue.push({ name: fileName, callback });
    }
    else {
      // Return existing asset
      callback(asset);
    }

    // Start loading if asset is not queued
    if (queued === false) {
      // Conditionally load file types
      if (this.types.audio.includes(fileType)) {
        // Load Audio type
        const audio = new Audio(this.audioListener);
        this.audioLoader.load(url, buffer => this.assign(fileName, audio.setBuffer(buffer)));
      }
      else if (this.types.models.includes(fileType)) {
        // Load GLTF type
        this.gltfLoader.load(url, gltf => this.assign(fileName, gltf.scene));
      }
      else if (this.types.textures.includes(fileType)) {
        // Load Texture type
        this.textureLoader.load(url, texture => this.assign(fileName, texture));
      }
      else {
        console.error(`File type ".${ fileType }" not supported`);
      }
    }
  }

  loadBatch(urls) {
    urls.forEach(path => this.load(path));
  }

  assign(name, asset) {
    // Set loaded asset by name
    this.set(name, asset);
 
    // Remove item from queue and run callbacks
    for (let i = this.queue.length - 1; i >= 0; i--) {
      if (this.queue[i].name === name) {
        this.queue[i].callback(asset);
        this.queue.splice(i, 1);
      }
    }
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