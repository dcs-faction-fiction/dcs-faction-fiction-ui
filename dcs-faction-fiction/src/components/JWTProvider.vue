<!--

Takes care of obtaining the JWT, saving it to the local store, and triggering logged in/out events.

-->

<template>
  <div>
    <div v-show="!localLoggedIn">
      <md-field><md-input v-model="localToken"/></md-field>
      <md-button @click="login">LOGIN</md-button>
    </div>
    <div v-show="localLoggedIn">
      <md-button @click="logout">LOGOUT</md-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loggedIn: Boolean,
    isFactionManager: Boolean,
    isCampaignManager: Boolean
  },
  data() {
    return {
      localToken: localStorage.token,
      localLoggedIn: this.loggedIn
    }
  },
  methods: {
    login() {
      this.localLoggedIn = !! this.localToken
      this.$emit('update:loggedIn', this.localLoggedIn)
      if (this.localToken) {
        var t = this
        // This is a quick way to check a valid token as this
        // api is basically public to anyone that has a token
        fetch(this.apiUrl+'/common-api/enums', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer' + this.localToken,
          }
        })
        .then(() => {
          localStorage.token = t.localToken
          t.updateRoles()
          t.$eventHub.$emit('logged-in')
        })
        .catch(err => console.log(err))
      }
    },
    logout() {
      delete localStorage.token
      this.localToken = undefined
      this.localLoggedIn = false
      this.$emit('update:loggedIn', this.localLoggedIn)
      this.$eventHub.$emit('logged-out')
    },
    updateRoles() {
      var jwtExploded = this.parseJwt(localStorage.token)
      this.$emit('update:isFactionManager', jwtExploded.roles.includes("faction_manager"))
      this.$emit('update:isCampaignManager', jwtExploded.roles.includes("campaign_manager"))
    },
    parseJwt(token) {
      var base64Url = token.split('.')[1]
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))

      return JSON.parse(jsonPayload)
    }
  },
  mounted() {
    this.localLoggedIn = !! this.localToken
    if (localStorage.token) {
      this.updateRoles()
      this.$emit('update:loggedIn', true)
      this.$eventHub.$emit('logged-in')
    }
  }
}
</script>

<style>

</style>