<template>
  <article id="profile" class="container">
    <section class="hero is-primary">
      <div class="hero-body">
        <p class="title">
          Proposal Review Tool
        </p>
        <p class="subtitle">
          Load a file to get started
        </p>
      </div>
    </section>
    <section class="section">
      <b-field label="IdeaScale username">
        <b-input v-model="name"></b-input>
      </b-field>

      <b-field label="Email">
        <b-input type="email" v-model="email"></b-input>
      </b-field>

      <div class="main-choice" v-if="!localDb && localChoice === false">
        <h2>Choose an option to start your process:</h2>
        <div class="is-flex columns mt-6 mb-6">
          <div class="is-half column has-text-centered">
            <b-button class="is-primary special-button" @click="setLocalChoice('start')">
              I want to start the process from the beginning<br />
              I don't have a backup file to import
            </b-button>
          </div>
          <div class="is-half column has-text-centered">
            <b-button class="is-primary is-light special-button" @click="setLocalChoice('import')">
              I want to continue the process<br />
              I have a backup file to import
            </b-button>
          </div>
        </div>
      </div>

      <div class="csv-load" v-if="!localDb && localChoice === 'import'">
        <b-field class="file is-primary">
          <b-upload v-on:input="readFile" drag-drop expanded accept=".csv">
            <section class="section">
              <div class="content has-text-centered">
                <p>
                  <b-icon icon="upload" size="is-large" v-if="!csv"></b-icon>
                  <b-icon icon="check" size="is-large" v-if="csv"></b-icon>
                </p>
                <p>Drop your file here or click to upload</p>
              </div>
            </section>
          </b-upload>
        </b-field>

        <b-message v-if="csv" type="is-success">
          No of assessments to be loaded: {{ csv.data.length }}
        </b-message>

        <b-message v-if="!csv" type="is-information">
          Upload CSV to load assessments.
        </b-message>

        <b-button
          type="is-primary"
          :disabled="!csv"
          @click="importCsv"
          >Import Data</b-button
        >
      </div>
      <b-button
        v-if="localDb"
        class="mr-3 mt-3"
        type="is-primary is-light"
        @click="exportCsv">
        Save / Export CSV</b-button>
      <b-button
        class="mt-3"
        tag="router-link"
        to="/assessments"
        v-if="localDb"
        type="is-primary"
        >
        Back to assessments</b-button>
      <b-message type="is-danger mt-5" v-if="localDb">
        <p>You've already loaded the CSV. Use this button to clear the database from your browser.</p>
        <p>Be careful, this operation is not reversible!</p>
        <b-button type="is-danger mt-5" @click="confirmClear">Clear local database</b-button>
      </b-message>
    </section>
  </article>
</template>

<script>
import { mapState } from "vuex";
import csvHeaders from "../assets/data/import-csv-headers.json";
import DownloadMixin from '@/mixins/download'

export default {
  name: "Profile",
  mixins: [DownloadMixin],
  data() {
    return {
      csv: null,
      csvHeaders: csvHeaders,
      localChoice: false
    };
  },
  computed: {
    ...mapState({
      initialized: (state) => state.profile.initialized,
      localDb: (state) => state.profile.localDb,
    }),
    name: {
      get() {
        return this.$store.state.profile.info.name;
      },
      set(value) {
        this.$store.commit("profile/setName", value);
      },
    },
    email: {
      get() {
        return this.$store.state.profile.info.email;
      },
      set(value) {
        this.$store.commit("profile/setEmail", value);
      },
    },
  },
  methods: {
    importCsv() {
      if (this.csv) {
        if (this.csv.data) {
          this.$store.commit("profile/setLocalDb", true);
          this.$store.commit("assessments/setAssessments", this.csv.data);
          this.$router.push({"name": "conditions"})
        }
      }
    },
    onComplete(results) {
      results.data = results.data.map((el) => {
        return this._.pick(el, Object.keys(this.csvHeaders))
      })
      this.csv = results;
    },
    transformHeader(header) {
      const newHeaders = {}
      Object.keys(this.csvHeaders).forEach((h) => {
        newHeaders[this.csvHeaders[h].label] = h
      })
      if (newHeaders[header]) {
        return newHeaders[header]
      }
      return header
    },
    readFile(file) {
      this.$papa.parse(file, {
        complete: this.onComplete,
        transformHeader: this.transformHeader,
        error: this.errorHandling,

        dynamicTyping: true,
        header: true,
        skipEmptyLines: true
      });
    },
    clear() {
      this.$store.commit("profile/resetState");
      this.$store.commit("assessments/resetState");
    },
    confirmClear() {
      this.$buefy.dialog.confirm({
        title: 'Clear database',
        message: 'Are you sure you want to <b>clear</b> the local database? This action cannot be undone and you will lose your work.',
        confirmText: 'Clear Database',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => {
          this.clear();
          this.$buefy.toast.open('Database cleared!')
        }
      })
    },
    setLocalChoice(value) {
      if (value == 'start') {
        this.$store.commit("profile/setLocalDb", true);
        this.$router.push({"name": "conditions"})
      } else if (value === 'import') {
        this.localChoice = 'import'
      }
    }
  },
};
</script>

<style lang="scss">
  .special-button {
    max-height: none !important;
    height: auto !important;
  }
</style>
