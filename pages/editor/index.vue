<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">
          <ul class="error-messages">
            <template v-for="(messages,field) in errors">
              <li
                v-for="(message, index) in messages"
                :key="index"
              >{{ field }} {{ message }}
              </li>
            </template>
          </ul>
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  v-model="article.title"
                  required
                >
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  v-model="article.description"
                  required
                >
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  v-model="article.body"
                  required
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  v-on:keyup.enter="addTag"
                  v-model="tag"
                >
                <div class="tag-list">
                  <span
                    v-for="(tag, index) in article.tagList"
                    :key="index"
                    class="tag-default tag-pill"
                  >
                  <i
                    class="ion-close-round"
                    @click="removeTag(index)"
                  ></i>
                  {{ tag }}
                </span>
                </div>
              </fieldset>
              <button
                @click="onSubmit"
                type="button"
                class="btn btn-lg pull-xs-right btn-primary"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { getArticle, createArticle, updateArticle } from '@/api/article'

export default {
  name: 'EditorIndex',
  middleware: ['authenticated'],
  data () {
    return {
      tag: '',
      errors: null,
      article: {
        title: '',
        description: '',
        body: '',
        tagList: [],
      },
    }
  },
  async mounted () {
    const slug = this.$route.params.slug
    if (slug) {
      this.slug = slug
      const { data } = await getArticle(slug)
      this.article = data.article
    }
  },
  methods: {
    addTag () {
      if (!this.tag) return
      this.article.tagList.push(this.tag)
      this.tag = ''
    },
    removeTag (index) {
      this.article.tagList.splice(index, 1)
    },
    async onSubmit () {
      try {
        if (this.slug) {
          // 编辑文章
          const { data } = await updateArticle(this.slug, { article: this.article })
          this.$router.push(`/article/${data.article.slug}`)
        } else {
          // 新增文章
          const { data } = await createArticle({ article: this.article })
          this.$router.push(`/article/${data.article.slug}`)
        }
      } catch (err) {
        this.errors = err.response.data.errors
      }
    },
  },
}
</script>

<style>

</style>
