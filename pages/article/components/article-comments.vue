<template>
  <div>
    <form class="card comment-form" v-if="user">
      <div class="card-block">
              <textarea
                  class="form-control"
                  placeholder="Write a comment..."
                  rows="3"
              ></textarea>
      </div>
      <div class="card-footer">
        <img
            :src="user.image"
            class="comment-author-img"
        />
        <button class="btn btn-sm btn-primary">
          Post Comment
        </button>
      </div>
    </form>
    <div class="card" v-for="comment in comments" :keu="comment.id">
      <div class="card-block">
        <p class="card-text">{{comment.body}}</p>
      </div>
      <div class="card-footer">
        <nuxt-link
            :to="{name:'profile',params:{username:comment.author.username}}"
            class="comment-author"
        >
          <img
              :src="comment.author.image"
              class="comment-author-img"
          />
        </nuxt-link>
        &nbsp;
        <nuxt-link
            :to="{name:'profile',params:{username:comment.author.username}}"
            class="comment-author"
        >{{comment.author.username}}</nuxt-link>
        <span class="date-posted">{{comment.createAt | date('MMM DD, YYYY')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments } from '@/api/article'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['user']),
  },
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  name: 'articleComments',
  data () {
    return {
      comments: [],
    }
  },
  async mounted () {
    const { data } = await getComments(this.article.slug)
    this.comments = data.comments
  },
}
</script>

<style>

</style>
