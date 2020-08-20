<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p v-if="profile.bio">
              {{ profile.bio }}
            </p>
            <template v-if="isMaster">
              <nuxt-link
                  class="btn btn-sm btn-outline-secondary action-btn"
                  to="/settings"
              >
                <i class="ion-edit"></i> Edit Profile Settings
              </nuxt-link>
<!--              <button class="btn btn-sm btn-outline-secondary action-btn">-->
<!--                <i class="ion-edit"></i> Edit Profile Settings-->
<!--              </button>-->
            </template>
            <template v-else>
              <button
                  class="btn btn-sm btn-outline-secondary action-btn"
                  :class="{active:profile.following}"
                  @click="onFollow(profile)"
                  :disabled="profile.followDisabled"
              >
                <i class="ion-plus-round"></i>
                &nbsp;
                {{ profile.following ? 'Unfollow' : 'Follow' }} {{ profile.username }}
              </button>
            </template>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                    exact
                    class="nav-link"
                    :class="{active: tab === 'my'}"
                    :to="{name:'profile',query: {tab:'my'}}"
                >My Articles
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                    exact
                    class="nav-link"
                    :class="{active: tab === 'favorited'}"
                    :to="{name:'profile',query: {tab:'favorited'}}"
                >Favorited Articles
                </nuxt-link>
              </li>
            </ul>
          </div>

          <div
              class="article-preview"
              v-for="article in articles"
              :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link :to="{name:'profile',params:{username:article.author.username}}">
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link :to="{name:'profile',params:{username:article.author.username}}">
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button
                  @click="onFavorite(article)"
                  class="btn btn-outline-primary btn-sm pull-xs-right"
                  :class="{active: article.favorited}"
                  :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
                :to="{name:'article', params:{slug:article.slug}}"
                class="preview-link"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>

          <nav>
            <ul class="pagination">
              <li class="page-item" :class="{active: item === page}" v-for="item in totalPage" :key="item">
                <nuxt-link
                    class="page-link"
                    :to="{
                            name: 'profile',
                            params: {
                              username: profile.username
                            },
                            query: {
                              page: item,
                              tab
                            }
                          }"
                >{{ item }}
                </nuxt-link>
              </li>
            </ul>
          </nav>

        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { getProfile } from '@/api/user'
import { mapState } from 'vuex'
import { addFavorite, addFollow, deleteFavorite, deleteFollow, getArticles } from '@/api/article'

export default {
  name: 'ProfileIndex',
  middleware: ['authenticated'],
  watchQuery: ['page', 'author', 'tab'],
  data () {
    return {
      profile: {},
    }
  },
  computed: {
    ...mapState(['user']),
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    },
    // 是自己
    isMaster () {
      return this.profile.username === this.user?.username
    },
  },
  mounted () {
    this.$set(this.profile, 'followDisabled', false)
  },
  async asyncData ({ params, query }) {
    const author = params.username
    const tab = query.tab || 'my'
    const page = Number.parseInt(query.page || 1)
    const articleParams = tab === 'my'
        ? { author }
        : { favorited: author }
    const limit = 2
    const offset = (page - 1) * limit
    articleParams.limit = limit
    articleParams.offset = offset
    const [articleRes, profileRes] = await Promise.all([
      getArticles(articleParams),
      getProfile(params.username),
    ])
    const { articles, articlesCount } = articleRes.data
    const { profile } = profileRes.data
    articles.forEach(article => article.favoriteDisabled = false)
    return { profile, tab, articles, articlesCount, page, limit }
  },
  methods: {
    async onFollow (profile) {
      profile.followDisabled = true
      if (profile.following) {
        await deleteFollow(profile.username)
        profile.following = false
      } else {
        await addFollow(profile.username)
        profile.following = true
      }
      profile.followDisabled = false
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
