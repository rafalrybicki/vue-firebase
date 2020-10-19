<template>
   <transition name="fade">
      <div class="p-modal">
         <div class="p-container">
            <a 
               @click="$emit('close-post-modal')" 
               class="close"
            >close</a>
            <div class="post">
               <h5>{{ post.userName }}</h5>
               <span>{{ post.createdOn | formatDate }}</span>
               <p>{{ post.content }}</p>
               <ul>
                  <li>comments {{ post.comments }}</li>
                  <li>likes {{ post.likes }}</li>
               </ul>
            </div>
            <div v-show="postComments.length" class="comments">
               <div 
                  v-for="comment in postComments" 
                  :key="comment.id" 
                  class="comment"
               >
                  <p>{{ comment.userName }}</p>
                  <span>{{ comment.createdOn | formatDate }}</span>
                  <p>{{ comment.content }}</p>
               </div>
            </div>
         </div>
      </div>
   </transition>  
</template>

<script>
import { commentsCollection } from '@/firebase'
import moment from 'moment'

export default {
   props: {
      post: {
         type: Object,
         required: true
      }
   },
   data() {
      return {
         postComments: []
      }
   },
   async created() {
      const docs = await commentsCollection.where('postId', '==', this.post.id).get()
      docs.forEach(doc => {
         let comment = doc.data()
         comment.id = doc.id
         this.postComments.push(comment)
      })
   },
   filters: {
      formatDate(val) {
         if (!val) { return '-' }
         let date = val.toDate()
         return moment(date).fromNow()
      }
   }
}
</script>

<style scoped>
   li {
      color: blue;
   }
</style>