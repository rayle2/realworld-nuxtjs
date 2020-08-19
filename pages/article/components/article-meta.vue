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
    <template v-if="isMaster">
      <nuxt-link
        class="btn btn-outline-secondary btn-sm"
        :to="{
          name: 'editor',
          params: {
            slug: article.slug,
          },
        }"
      >
        <i class="ion-edit"></i> Edit Article
      </nuxt-link>
      &nbsp;&nbsp;
      <button
        class="btn btn-outline-danger btn-sm"
        :class="{ disabled: article.isDeleting }"
        @click="onDelete(article)"
      >
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </template>
    <template v-else>
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{active:article.author.following}"
        @click="onFollow(article.author)"
        :disabled="article.author.followDisabled"
      >
        <i class="ion-plus-round"></i>
        &nbsp;
        {{ article.author.following ? 'Unfollow' : 'Follow' }} {{ article.author.username }}
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
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { addFollow, deleteFollow, addFavorite, deleteFavorite, deleteArticle } from '@/api/article'

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
    // 是自己写的文章
    isMaster () {
      return this.article.author.username === this.user?.username
    },
  },
  name: 'ArticleMeta',
  mounted () {
    this.$set(this.article, 'favoriteDisabled', false)
    this.$set(this.article.author, 'followDisabled', false)
    this.$set(this.article, 'isDeleting', false)
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
    async onDelete (article) {
      article.isDeleting = true
      await deleteArticle(article.slug)
      this.$router.push('/')
      article.isDeleting = false
    },
  },
}
</script>

<style>

</style>
