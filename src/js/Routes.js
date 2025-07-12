import PageDynamicController from '../vue/PageDynamicController.vue'
import PageDynamicPointerController from '../vue/PageDynamicPointerController.vue'
import PageKinematicController from '../vue/PageKinematicController.vue'

/*
  Vue Router is used to change page components using URL paths. This solution 
  reduces the need for multiple v-if conditions in the App.vue file.

  Usage: See Main.js file
*/

export default [
  {
    name: 'home',
    path: '/',
    redirect: '/dynamic-controller'
  },
  {
    name: 'dynamic-controller',
    path: '/dynamic-controller',
    component: PageDynamicController,
    meta: {
      title: 'Dynamic Controller'
    }
  },
  {
    name: 'dynamic-pointer-controller',
    path: '/dynamic-pointer-controller',
    component: PageDynamicPointerController,
    meta: {
      title: 'Dynamic Pointer Controller'
    }
  },
  {
    name: 'kinematic-controller',
    path: '/kinematic-controller',
    component: PageKinematicController,
    meta: {
      title: 'Kinematic Controller'
    }
  },

  {
    path: '/:pathMatch(.*)*', // Catch-all route
    name: 'NotFound',
    redirect: '/'
  },
];