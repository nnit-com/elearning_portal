import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {path:'*',redirect:'/'},
  {path:'/',redirect:'/elearningmain'},
  {path:'/Login',component: () => import('@/components/menu/IWFLogin.vue')},

  //elearning main page router
  {path:'/elearningmain',component:() => import('@/components/menu/eLearningMain.vue'),
    children:[
      {path:'training',component:() => import('@/components/elearningpage/training.vue')},
      {path:'course', name: 'Course',component:() => import('@/components/elearningpage/course.vue')},
      {path:'quiz', name: 'Quiz',component:() => import('@/components/elearningpage/quiz.vue')},
      {path:'score', name: 'Score',component:() => import('@/components/elearningpage/score.vue')},
      {path:'publictraininglist',component:() => import('@/components/elearningpage/publictraininglist.vue')},
      {path:'mytraininglist',component:() => import('@/components/elearningpage/mytraininglist.vue')},
      {path:'',component:() => import('@/components/elearningpage/training.vue')},
    ]
  }

]

const router = new VueRouter({
  routes
})

export default router
