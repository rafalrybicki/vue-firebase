<template>
   <div class="login col2 signup-form">
      <form @submit.prevent>
         <h1>Get Started</h1>
         <div>
            <label for="name">Name</label>
            <input
               v-model.trim="name"
               type="text"
               id="name"
            />
         </div>
         <div>
            <label for="title">Job Title</label>
            <input
               v-model.trim="title"
               type="text"
               id="title"
            />
         </div>
         <div>
            <label for="email">Email</label>
            <input
               v-model.trim="email"
               type="text"
               id="email"
            />
         </div>
         <div>
            <label for="password">Password</label>
            <input
               v-model.trim="password"
               type="password"
               id="password"
            />
         </div>
         <p 
            v-if="errorMsg" 
            class="error"
         >{{ errorMsg }}</p>
         <button 
            @click="signup()"
            class="button"
            :disabled="disabled"
         >Sign Up</button>
      </form>
   </div>
</template>

<script>
import { auth, usersCollection } from '@/firebase'

export default {
   data() {
      return {
         name: '',
         title: '',
         email: '',
         password: '',
         errorMsg: ''
      }
   },
   methods: {
      async signup() {
         this.errorMsg = ''
         try {
            const { user } = await auth.createUserWithEmailAndPassword(this.email, this.password)
            
            await usersCollection.doc(user.uid).set({
               name: this.name,
               title: this.title
            })
            this.$router.push('/')
         } catch (err) {
            this.errorMsg = err.message
         }
      }
   },
   computed: {
      disabled() {
         return this.email === '' || this.password === '' || this.name === '' || this.title === ''
      }
   }
}
</script>

<style scoped>
   form {
      max-width: 450px;
      margin: 0 auto;
      padding-top: 20vh;
   }
</style>