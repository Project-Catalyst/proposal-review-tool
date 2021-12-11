<template>
  <b-modal class="assessment"
    :key="`modal-${assessment.id}`"
    :ref="'modal'"
    v-model="isOpen"
    :can-cancel="false"
    :animation="'no-animation'"
    full-screen
    >
    <div class="card container custom-card" v-if="assessment">
      <div class="card-content">
        <p class="title is-4">
          {{ assessment.title }} <span class="is-size-5 has-text-weight-bold">(<a :href="assessment.url" target="_blank">See proposal in IdeaScale</a>)</span>
        </p>
        <p class="subtitle is-5">{{ category.title }}</p>
        <p class="is-6">
          <strong>Assessor:</strong>
          {{ assessment.assessor }}
        </p>

        <div class="columns is-multiline is-mobile">
          <div class="column is-three-quaters">
          </div>
          <div class="column is-one-quarter">
          </div>
          <div class="column is-three-quarters">
            <p class="title is-6 mb-4">
              Impact / Alignment
            </p>
            <b-rate size="is-medium" v-model="assessment.impact_rating" disabled />
            <p class="subtitle is-6 mb-2">{{ assessment.impact_note }}</p>
          </div>
          <div class="column is-one-quarter">
          </div>
          <div class="column is-three-quarters">
            <p class="title is-6 mb-4">Feasibility</p>
            <b-rate size="is-medium" v-model="assessment.feasibility_rating" disabled />
            <p class="subtitle is-6 mb-2">{{ assessment.feasibility_note }}</p>
          </div>
          <div class="column is-one-quarter">
          </div>
          <div class="column is-three-quarters">
            <p class="title is-6 mb-4">Auditability</p>
            <b-rate size="is-medium" v-model="assessment.auditability_rating" disabled />
            <p class="subtitle is-6 mb-2">{{ assessment.auditability_note }}</p>
          </div>
          <div class="column is-one-quarter">
          </div>
        </div>
        <div class="columns is-mobile is-centered">
          <section class="column is-narrow">
            <p class="title is-4">Do you want to report this review?</p>
            <b-field>
              <b-checkbox v-model="review"
                native-value="not_valid"
                size="is-large"
                type="is-danger is-light is-outlined">
                Filtered Out
              </b-checkbox>
            </b-field>
            <b-field label="Your rationale for the report:">
              <b-input type="textarea" v-model="debouncedRationale"></b-input>
            </b-field>
          </section>
        </div>
      </div>
      <footer class="card-footer custom-footer">
        <router-link class="card-footer-item" :to="{ name: 'conditions' }">
          Overview
        </router-link>

        <a @click="getNext" class="card-footer-item">
          Next
        </a>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import proposals from "../assets/data/proposals.json";
import categories from "../assets/data/categoriesById.json";
import debounce from 'lodash.debounce';


export default {
  name: "Assessment",
  data() {
    return {
      proposals: proposals,
      categories: categories,
      isOpen: true
    };
  },
  computed: {
    ...mapGetters("assessments", ["getById"]),
    ...mapState({
      profile: (state) => state.profile
    }),
    assessment() {
      return this.getById(this.$route.params.id)
    },
    category() {
      if (this.assessment) {
        return this.categories[this.assessment.challenge_id]
      }
      return false;
    },
    review: {
      get() {
        return this.assessment.not_valid
      },
      set(val) {
        this.$store.commit('assessments/setReview', {
          id: this.$route.params.id,
          value: val
        });
      }
    },
    debouncedRationale: {
      get() {
        return this.assessment.not_valid_rationale;
      },
      set: debounce(function(val) {
        this.$store.commit('assessments/setRationaleReview', {
          id: this.$route.params.id,
          value: val
        });
      }, 500)
    }
  },
  methods: {
    self() {
      return this;
    },
    getNext() {
      this.$store.dispatch('assessments/getNext')
    },
  }
};
</script>

<style lang="scss" scoped>
.column {
  &.yellow {
    background: #ffef93;
  }
  &.red {
    background: #ff9393;
    width: 100% !important;
  }
  &.green {
    background: #baffb2;
  }
  &.not_related, &.other, &.other_rationale {
    width: 100% !important;
  }
}
.inline {
  display: inline-block;
}
.always-opaque {
  opacity: 1 !important;
}
.custom-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  padding: .10rem;
  background: #fff;
  width: 100%;
  z-index: 10;
}
.custom-card {
  padding-bottom: 60px;
}
.larger-tooltip {
  .tooltip-content {
    width: 500px;
  }
}
</style>
<style lang="scss">
.larger-tooltip .tooltip-content {
  width: 500px !important;
  max-width: 100vw !important;
}
</style>
