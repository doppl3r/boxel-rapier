import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

/*
  This class creates new 2D DOM instances that get rendered
  using the CSS2DRenderer.js library.
*/

class DOMFactory {
  constructor() {
    
  }

  static create(options) {
    options = Object.assign({
      className: 'CSS2DObject',
      innerHTML: 'Hello, World!',
      localName: 'div',
      style: ''
    }, options);

    // Create DOM element using options
    const element = document.createElement(options.localName);
    element.className = options.className;
    element.innerHTML = options.innerHTML;
    element.style = options.style;

    // Initialize 3D object component with new DOM element
    const object3D = new DOMFactory[options.type](element);

    // Ensure this 3D object is removed after parent 3D object is removed
    object3D.addEventListener('added', () => {
        object3D.parent.addEventListener('removed', () => object3D.removeFromParent());
      }
    );

    // Return newly created 3D object
    return object3D;
  }

  // Assign all Three.js 3D object classes as static fields
  static CSS2DObject = CSS2DObject;
}

export { DOMFactory }