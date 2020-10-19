<template>
   <section id="settings">
      <div class="col1">
         <h3>Settings</h3>
         <p>Update your profile</p>

         <transition name="fade">
            <p
               v-if="showSuccess"
               class="success"
            >profile updated</p>
         </transition>

         <form @submit.prevent>
         <label for="name">Name</label>
         <input
            v-model.trim="name"
            type="text"
            id="name"
         />

         <label for="title">Job Title</label>
         <input
            v-model.trim="title"
            type="text"
            id="title"
         />

         <button 
            @click="updateProfile()" 
            class="button"
            :disabled="disabled"
         >Update Profile</button>
         </form>
      </div>
   </section>
</template>

<script>
export default {
   data() {
      return {
         name: this.$store.state.userProfile.name,
         title: this.$store.state.userProfile.title,
         userName: this.$store.state.userProfile.name,
         userTitle: this.$store.state.userProfile.title,
         
         showSuccess: false
      }
   },
   computed: {
      disabled() {
         return (this.name == '' || this.name === this.userName) && (this.title === '' || this.title === this.userTitle)
      }
   },
   methods: {
      updateProfile() {
         this.$store.dispatch('updateProfile', {
            name: this.name,
            title:  this.title
         })
         this.name = ''
         this.title = ''
         this.showSuccess = true
         setTimeout(() => {
            this.showSuccess = false
         }, 1000)
      }
   }
}
</script>