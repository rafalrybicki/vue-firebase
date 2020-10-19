/* eslint-disable no-unused-vars */
import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'
import router from '../router/index'

Vue.use(Vuex)

const store = new Vuex.Store({
   state: {
      userProfile: {},
      posts: [],
      errors: {
         login: '',
         register: '',
      }
   },
   mutations: {
      setUserProfile(state, val) {
         state.userProfile = val
      },
      setPosts(state, val) {
         state.posts = val
      },
      setError(state, payload) {
         state.errors[payload.key] = payload.val
      }
   },
   actions: {
      async fetchUserProfile({ commit }, userData) {
         const userProfile = await fb.usersCollection.doc(userData.uid).get()

         const user = userProfile.data()
         user.id = userData.uid

         commit('setUserProfile', user)
         
         if (router.currentRoute.path === '/login') {
            router.push('/')
         }
      },

      async signup({ dispatch }, form) {
         const { user } = await fb.auth.createUserWithEmailAndPassword(form.email, form.password)
         
         await fb.usersCollection.doc(user.uid).set({
            name: form.name,
            title: form.title
         })
         
         dispatch('fetchUserProfile', user)
      },

      async logout({ commit }) {
         await fb.auth.signOut()
       
         commit('setUserProfile', {})
         
         router.push('/login')
      },

      async createPost({ state }, post) {
         await fb.postsCollection.add({
           createdOn: new Date(),
           content: post.content,
           userId: fb.auth.currentUser.uid,
           userName: state.userProfile.name,
           comments: 0,
           likes: 0
         })
      },

      async likePost ({ commit }, post) {
         const userId = fb.auth.currentUser.uid
         const docId = `${userId}_${post.id}`
   
         const doc = await fb.likesCollection.doc(docId).get()
         if (doc.exists) { 
            fb.likesCollection.doc(docId).delete()
            fb.postsCollection.doc(post.id).update({
               likes: post.likesCount - 1
             })
            return 
         }

         await fb.likesCollection.doc(docId).set({
           postId: post.id,
           userId: userId
         })
       
         fb.postsCollection.doc(post.id).update({
           likes: post.likesCount + 1
         })
      },

      async deletePost (state, postId) {
         fb.postsCollection.doc(postId).delete();
         const comments = await fb.commentsCollection.where('postId', '==', postId).get();
         comments.forEach(doc => {
            fb.commentsCollection.doc(doc.id).delete()
         })
      },

      async updateProfile({ dispatch }, user) {
         const userId = fb.auth.currentUser.uid

         await fb.usersCollection.doc(userId).update({
            name: user.name,
            title: user.title
         })
      
         dispatch('fetchUserProfile', { uid: userId })
      
         const postDocs = await fb.postsCollection.where('userId', '==', userId).get()
         postDocs.forEach(doc => {
            fb.postsCollection.doc(doc.id).update({
               userName: user.name
            })
         })
      
         const commentDocs = await fb.commentsCollection.where('userId', '==', userId).get()
         commentDocs.forEach(doc => {
            fb.commentsCollection.doc(doc.id).update({
               userName: user.name
            })
         })
      }
   },
   modules: {
   }
})

fb.postsCollection.orderBy('createdOn', 'desc').onSnapshot(snapshot => {
   let postsArray = []

   snapshot.forEach(doc => {
      let post = doc.data()
      post.id = doc.id

      postsArray.push(post)
   })

   store.commit('setPosts', postsArray)
})

export default store