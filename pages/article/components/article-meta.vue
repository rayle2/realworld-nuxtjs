<template>
  <div class="article-meta">
    <nuxt-link :to="{name:'profile',params: {username:article.author.username}}">
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link
          :to="{name:'profile',params: {username:article.author.name}}"
          class="author"
      >{{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
    </div>
    <button
        class="btn btn-sm btn-outline-secondary"
        :class="{active:article.author.following}"
        @click="onFollow(article.author)"
        :disabled="article.author.followDisabled"
    >
      <i class="ion-plus-round"></i>
      &nbsp;
      {{ article.author.following ? 'Unfollow' : 'Follow' }} {{ article.author.username }}
      <!--      <span class="counter">({{ article.author.username }})</span>-->
    </button>
    &nbsp;&nbsp;
    <button
        class="btn btn-sm btn-outline-primary"
        :class="{active:article.favorited}"
        @click="onFavorite(article)"
        :disabled="article.favoriteDisabled"
    >
      <i class="ion-heart"></i>
      &nbsp;
      Favorite Post <span class="counter">({{ article.favoritesCount }})</span>
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { addFollow, deleteFollow, addFavorite, deleteFavorite } from '@/api/article'

export default {
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      btnDis: true,
    }
  },
  computed: {
    ...mapState(['user']),
  },
  name: 'ArticleMeta',
  mounted () {
    this.$set(this.article, 'favoriteDisabled', false)
    this.$set(this.article.author, 'followDisabled', false)
  },
  methods: {
    async onFollow (author) {
      if (!this.user) return this.$router.push('/login')
      author.followDisabled = true
      if (author.following) {
        // 取消点赞
        await deleteFollow(author.username)
        author.following = false
      } else {
        // 添加点赞
        await addFollow(author.username)
        author.following = true
      }
      author.followDisabled = false
    },
    async onFavorite (article) {
      article.favoriteDisabled = true
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      } else {
        // 添加点赞
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    },
  },
}
</script>

<style>

</style>
