<!--

Takes care of obtaining the JWT, saving it to the local store, and triggering logged in/out events.

-->

<template>
  <div>
    <div v-show="!localLoggedIn">
      <input v-model="localToken"/>
      <button @click="login">LOGIN</button>
    </div>
    <div v-show="localLoggedIn">
      <button @click="logout">LOGOUT</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loggedIn: Boolean,
  },
  data() {
    return {
      localToken: localStorage.token,
      localLoggedIn: this.loggedIn
    }
  },
  methods: {
    login() {
      localStorage.token = this.localToken
      this.localLoggedIn = !! this.localToken
      this.$emit('update:loggedIn', this.localLoggedIn)
      this.$eventHub.$emit('logged-in');
    },
    logout() {
      localStorage.token = undefined
      this.localToken = undefined
      this.localLoggedIn = false
      this.$emit('update:loggedIn', this.localLoggedIn)
      this.$eventHub.$emit('logged-out');
    }
  },
  mounted() {
    this.localLoggedIn = !! this.localToken
    if (this.localToken) {
      this.$emit('update:loggedIn', true)
      this.$eventHub.$emit('logged-in');
    }
  }
}
</script>

<style>

</style>