import PageJoystick2D from '../vue/PageJoystick2D.vue'
import PageVoxels from '../vue/PageVoxels.vue'

/*
  Vue Router is used to change page components using URL paths. This solution 
  reduces the need for multiple v-if conditions in the App.vue file.

  Usage: See Main.js file
*/

export default [
  {
    name: 'home',
    path: '/',
    redirect: '/joystick-2d'
  },
  {
    name: 'joystick-2d',
    path: '/joystick-2d',
    component: PageJoystick2D,
    meta: {
      title: 'Joystick 2D'
    }
  },
  {
    name: 'voxels',
    path: '/voxels',
    component: PageVoxels,
    meta: {
      title: 'Voxels'
    }
  }
];