<template>
   <div id="dashboard">
      <transition name="fade">
         <CommentModal 
            v-if="showCommentModal" 
            :post="selectedPost" 
            @close="toggleCommentModal()"
         ></CommentModal>
      </transition>
      <section>
         <div class="col1">
            <div class="profile">
            <h5>{{ userProfile.name }}</h5>
            <p>{{ userProfile.title }}</p>
            <div class="create-post">
               <form @submit.prevent>
                  <textarea v-model.trim="post.content"></textarea>
                  <button 
                  @click="createPost()" 
                  :disabled="!post.content" 
                  class="button"
                  >Add post</button>
               </form>
            </div>
            </div>
         </div>
         <div class="col2">
            <div v-if="posts.length">
            <div v-for="post in posts" :key="post.id" class="post">
               <h5>{{ post.userName }}</h5>
               <span>{{ post.createdOn | formatDate }}</span>
               <p>{{ post.content | trimLength }}</p>
               <ul>
                  <li>
                  <a @click="toggleCommentModal(post)">comments {{ post.comments }}</a>
                  </li>
                  <li>
                  <a @click="likePost(post.id, post.likes)">likes {{ post.likes }}</a>
                  </li>
                  <li>
                  <a @click="viewPost(post)">view full post</a></li>
                  <li 
                     class="red"
                     v-if="post.userId === $store.state.userProfile.id"
                     @click="$store.dispatch('deletePost', post.id)"
                  >Delete</li>
               </ul>
            </div>
            </div>
            <div v-else>
            <p class="no-results">There are currently no posts</p>
            </div>
         </div>
      </section>
      <PostModal 
         v-if="showPostModal" 
         :post="fullPost" 
         @close-post-modal="showPostModal = false"
      />
   </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import CommentModal from '@/components/CommentModal'
import PostModal from '@/components/PostModal'

export default {
   components: {
      CommentModal,
      PostModal
   },
   data() {
      return {
         post: {
            content: ''
         },
         showCommentModal: false,
         selectedPost: {},
         showPostModal: false,
         fullPost: {}
      }
   },
   computed: {
      ...mapState(['userProfile', 'posts'])
   },
   methods: {
      createPost() {
         this.$store.dispatch('createPost', { content: this.post.content })
         this.post.content = ''
      },
      toggleCommentModal(post) {
         this.showCommentModal = !this.showCommentModal

         if (this.showCommentModal) {
            this.selectedPost = post
         } else {
            this.selectedPost = {}
         }
      },
      likePost(id, likesCount) {
         this.$store.dispatch('likePost', { id, likesCount })
      },
      async viewPost(post) {
         this.fullPost = post
         this.showPostModal = true
      }
   },
   filters: {
      formatDate(val) {
         if (!val) { return '-' }
         let date = val.toDate()
         return moment(date).fromNow()
      },
      trimLength(val) {
         if (val.length < 200) { return val }
         return `${val.substring(0, 200)}...`
      }
   }
}
</script>

<style scoped>
   .red {
      color: red;
      cursor: pointer;
   }
</style>