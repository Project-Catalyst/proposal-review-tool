<template>
  <div id="app">
    <b-navbar class="is-primary">
      <template #brand>
        <b-navbar-item tag="router-link" :to="{ name: 'home' }">
          <img src="@/assets/images/catalyst.png" alt="Project Catalyst" />
        </b-navbar-item>
      </template>
      <template #end>
        <b-navbar-dropdown label="Proposal Review Tool">
          <b-navbar-item
            tag="router-link" :to="{ name: 'profile' }">
            Profile
          </b-navbar-item>
          <b-navbar-item
            v-if="profile.localDb"
            tag="router-link" :to="{ name: 'conditions' }">
            Assessments
          </b-navbar-item>
          <b-navbar-item
            v-if="profile.localDb"
            @click="exportCsv">
            Export CSV
          </b-navbar-item>
          <b-navbar-item
            tag="router-link" :to="{ name: 'home' }">
            Instructions
          </b-navbar-item>
          <!-- <b-navbar-item tag="router-link" :to="{ name: 'stats' }">
            Statistics
          </b-navbar-item> -->
        </b-navbar-dropdown>
      </template>
    </b-navbar>
    <router-view class="main-view" />
    <footer class="footer">
      <div class="content has-text-centered">
        <p>Made by Catalyst Community for the Cardano Community</p>
        <p><img class="aim-logo" src="@/assets/images/aim-logo.png" alt="Cardano AIM" /></p>
        <b-button
          label="Feedback"
          type="is-primary"
          icon-left="message-reply-text"
          tag="a"
          target="_blank"
          href="https://forms.gle/BUFPVPetPvetpQB5A"
          >
        </b-button>
      </div>
    </footer>
  </div>
</template>

<script>

import DownloadMixin from '@/mixins/download'

export default {
  mixins: [DownloadMixin],
  mounted() {
    if (window.localStorage) {
      let oldKeys = [
        'vca-tool-f4-default',
        'vca-tool-f5-default',
        'vca-tool-f6-default',
        'vca-tool-f7-default',
        'vca-tool-f8-default',
        'proposal-review-tool-f6-default',
      ]
      oldKeys.forEach((k) => {
        let oldKey = window.localStorage.getItem(k)
        if (oldKey) {
          window.localStorage.removeItem(k)
        }
      })
    }
  }
};
</script>

<style lang="scss">
.aim-logo {
  width: 150px;
}
</style>
