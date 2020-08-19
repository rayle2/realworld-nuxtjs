<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? 'Sing in' : 'Sign up' }}</h1>
          <p class="text-xs-center">
            <!-- <a href="">Have an account?</a> -->
            <nuxt-link
                v-if="isLogin"
                to="/register"
            >Need an account?
            </nuxt-link>
            <nuxt-link
                v-else
                to="/login"
            >Have an account?
            </nuxt-link>
          </p>

          <ul class="error-messages">
            <template v-for="(messages,field) in errors">
              <li
                  v-for="(message, index) in messages"
                  :key="index"
              >{{ field }} {{ message }}
              </li>
            </template>
          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset
                v-if="!isLogin"
                class="form-group"
            >
              <input
                  required
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  v-model="user.username"
              >
            </fieldset>
            <fieldset class="form-group">
              <input
                  required
                  type="email"
                  class="form-control form-control-lg"
                  placeholder="Email"
                  v-model="user.email"
              >
            </fieldset>
            <fieldset class="form-group">
              <input
                  required
                  minlength="8"
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  v-model="user.password"
              >
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{ isLogin ? 'Sing in' : 'Sign up' }}
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from '@/api/user'

const Cookie = process.client ? require('js-cookie') : undefined

export default {
  name: 'LoginIndex',
  // middleware: ['notAuthenticated'],
  data () {
    return {
      user: {
        username: '',
        email: '',
        password: '',
      },
      errors: {},
    }
  },
  computed: {
    isLogin () {
      return this.$route.name === 'login'
    },
  },
  methods: {
    async onSubmit () {
      try {
        const { data } = this.isLogin ? await login({ user: this.user }) : await register({ user: this.user })
        this.$store.commit('setUser', data.user)
        // 防止刷新页面数据丢失，做数据持久化
        Cookie.set('user', data.user)
        await this.$router.push('/')
      } catch (err) {
        this.errors = err.response.data.errors
        console.dir('失败', err)
      }
    },
  },
}
</script>

<style>

</style>
