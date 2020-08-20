<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li v-for="(message, index) in messages" :key="index">
                {{ field }} {{ message }}
              </li>
            </template>
          </ul>
          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                    class="form-control"
                    type="text"
                    placeholder="URL of profile picture"
                    v-model="user.image"
                >
              </fieldset>
              <fieldset class="form-group">
                <input
                    class="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                    v-model="user.username"
                >
              </fieldset>
              <fieldset class="form-group">
                <textarea
                    class="form-control form-control-lg"
                    rows="8"
                    placeholder="Short bio about you"
                    v-model="user.bio"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                    class="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                    v-model="user.email"
                >
              </fieldset>
              <fieldset class="form-group">
                <input
                    class="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                >
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr />
          <button class="btn btn-outline-danger" @click="logout">
            Logout.
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentUser, updateUser } from '@/api/user'

const Cookie = process.client ? require('js-cookie') : undefined
export default {
  name: 'SettingsIndex',
  middleware: ['authenticated'],
  data () {
    return {
      errors: null,
      user: {
        username: '',
        email: '',
        bio: '',
        image: '',
      },
    }
  },
  async mounted () {
    const { data } = await getCurrentUser()
    const { username, email, bio, image } = data.user
    this.$set(this.user, 'username', username)
    this.$set(this.user, 'email', email)
    this.$set(this.user, 'bio', bio)
    this.$set(this.user, 'image', image)
  },
  methods: {
    async onSubmit () {
      try {
        const { data: { user } } = await updateUser({ user: this.user })
        this.$store.commit('setUser', user)
        // 防止刷新页面数据丢失，做数据持久化
        Cookie.set('user', user)
        await this.$router.push(`/profile/${user.username}`)
      } catch (err) {
        console.log(err)
        this.errors = err.response.data.errors
        // console.dir('失败', err)
      }
    },
    logout () {
      this.$store.commit('setUser', null)
      Cookie.set('user', null)
      this.$router.push('/')
    },
  },
}
</script>

<style>

</style>
