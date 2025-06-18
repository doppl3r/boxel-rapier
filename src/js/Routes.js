import PageKinematic from '../vue/PageKinematic.vue'
import PageDynamic from '../vue/PageDynamic.vue'

/*
  Vue Router is used to change page components using URL paths. This solution 
  reduces the need for multiple v-if conditions in the App.vue file.

  Usage: See Main.js file
*/

export default [
  {
    name: 'home',
    path: '/',
    redirect: '/dynamic'
  },
  {
    name: 'dynamic',
    path: '/dynamic',
    component: PageDynamic,
    meta: {
      title: 'Dynamic Controller (DCC)'
    }
  },
  {
    name: 'kinematic',
    path: '/kinematic',
    component: PageKinematic,
    meta: {
      title: 'Kinematic Controller (KCC)'
    }
  }
];