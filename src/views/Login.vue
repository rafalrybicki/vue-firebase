<template>
   <div class="login">
      <PasswordReset 
         v-if="showPasswordReset" 
         @close="togglePasswordReset()"
      ></PasswordReset>
      <div class="col2 signup-form">
         <form @submit.prevent="login">
            <h1>Welcome Back</h1>
            <div>
               <label for="email1">Email</label>
               <input
                  v-model.trim="email"
                  type="text"
                  id="email1"
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
               type="submit"
               class="button"
               :disabled="disabled"
            >Log In</button>
            <div class="extras">
               <a @click="togglePasswordReset()">Forgot Password?</a>
               <router-link to="/register">Create an Account</router-link>
            </div>
         </form>
      </div>
   </div>
</template>

<script>
import { auth } from '@/firebase'
import PasswordReset from '@/components/PasswordReset'

export default {
   components: {
      PasswordReset
   },
   data() {
      return {
         email: '',
         password: '',
         errorMsg: '',
         showPasswordReset: false
      }
   },
   methods: {
      togglePasswordReset() {
         this.showPasswordReset = !this.showPasswordReset
      },
      async login() {
         this.errorMsg = ''
         try {
            await auth.signInWithEmailAndPassword(this.email, this.password)
         } catch (err) {
            this.errorMsg = err.message
         }

      }
   },
   computed: {
      disabled() {
         return this.email === '' || this.password === ''
      }
   }
}
</script>

<style scoped>

</style>