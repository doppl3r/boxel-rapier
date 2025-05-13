import { AudioListener, AudioLoader, EventDispatcher, TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class Assets extends EventDispatcher {
  constructor() {
    // Inherit Three.js EventDispatcher system
    super();

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

  load(url, onLoad) {
    // Load url array promises
    if (Array.isArray(url)) {
      const promises = url.map(path => this.load(path));
      this.track(promises);
      return Promise.all(promises).then(onLoad).catch(err => console.error(err));
    }

    // Get file details
    const fileType = url.substring(url.lastIndexOf('.') + 1);
    const fileName = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    let loader, promise;

    // Assign loader by file type
    if (this.types.audio.includes(fileType)) loader = this.audioLoader;
    else if (this.types.models.includes(fileType)) loader = this.modelLoader;
    else if (this.types.textures.includes(fileType)) loader = this.textureLoader;

    // Return promise from loader
    if (loader) {
      promise = loader.loadAsync(url)
        .then(value => { this.set(fileName, value); return url; })
        .catch(() => { console.error(`File "${ url }" not found`); return url; });
    }
    return promise;
  }

  track(promises) {
    let length = promises.length;
    promises.forEach(promise =>
      promise.then(url => this.dispatchEvent({
        type: 'onProgress',
        url: url,
        loaded: promises.length - (--length),
        total: promises.length
      }))
    );
  }

  set(key, value) {
    return this.cache[key] = value;
  }

  get(key) {
    return this.cache[key];
  }
}

export { Assets }