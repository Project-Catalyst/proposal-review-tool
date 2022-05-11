<template>
    <div class="assessment card container custom-card" v-if="fullAssessment">
      <div class="card-content">
        <p class="title is-4">
          {{ fullAssessment.title }} <span class="is-size-5 has-text-weight-bold">(<a :href="fullAssessment.url" target="_blank">See proposal in IdeaScale</a>)</span>
        </p>
        <p class="subtitle is-5">{{ category.title }}</p>
        <p class="is-6">
          <strong>Assessor:</strong>
          {{ fullAssessment.assessor }}
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
            <b-rate size="is-medium" v-model="fullAssessment.impact_rating" disabled />
            <p class="subtitle is-6 mb-2">{{ fullAssessment.impact_note }}</p>
          </div>
          <div class="column is-one-quarter">
          </div>
          <div class="column is-three-quarters">
            <p class="title is-6 mb-4">Feasibility</p>
            <b-rate size="is-medium" v-model="fullAssessment.feasibility_rating" disabled />
            <p class="subtitle is-6 mb-2">{{ fullAssessment.feasibility_note }}</p>
          </div>
          <div class="column is-one-quarter">
          </div>
          <div class="column is-three-quarters">
            <p class="title is-6 mb-4">Auditability</p>
            <b-rate size="is-medium" v-model="fullAssessment.auditability_rating" disabled />
            <p class="subtitle is-6 mb-2">{{ fullAssessment.auditability_note }}</p>
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
                @click.native="saveStatus = 'Saving...'"
                size="is-large"
                type="is-danger is-light is-outlined">
                Filtered Out
              </b-checkbox>
            </b-field>
            <b-field
              :type="(!navigationAvailable) ? 'is-danger' : ''"
              :message="(!navigationAvailable) ? 'Please fill out this field.' : ''"
              label="Provide your rationale for reporting OR your feedback to CA if not reported:">
              <b-input
                type="textarea"
                @keydown.native="saveStatus = 'Saving...'"
                v-model="debouncedRationale"></b-input>
            </b-field>
            <b-tag icon="content-save-outline" v-if="assessment.id">
              {{saveStatus}}
            </b-tag>
          </section>
        </div>

        <div class="columns is-centered">
          <b-tooltip multilined 
            type="is-warning is-light"
            label="Please fill all the required fields to continue."
            position="is-bottom"
            :active="!navigationAvailable">
            <b-button class="button mr-3 mt-3 is-primary is-light"
              type="is-primary"
              tag="router-link" :to="{ name: 'conditions', hash: `#${idx}`}"
              :disabled="!navigationAvailable">
              Assessments list / Overview
            </b-button>
          </b-tooltip>
          <b-tooltip multilined 
            type="is-warning is-light"
            label="Please fill all the required fields to continue."
            position="is-bottom"
            :active="!navigationAvailable">
            <b-button class="button mr-3 mt-3 is-primary"
              type="is-primary"
              @click="getNext"
              :disabled="!navigationAvailable">
              Next
            </b-button>
          </b-tooltip>
        </div>
      
      </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import proposals from "../assets/data/proposals.json";
import categories from "../assets/data/categoriesByName.json";
import debounce from 'lodash.debounce';


export default {
  name: "Assessment",
  data() {
    return {
      proposals: proposals,
      categories: categories,
      isOpen: true,
      saveStatus: 'Saved'
    };
  },
  computed: {
    ...mapGetters("assessments", ["getById", "getFullById"]),
    ...mapState({
      profile: (state) => state.profile
    }),
    idx() {
        if (this.$route.params.id > 1) {
          return this.$route.params.id -2
        } else {
          return 0
        }
    },
    assessment() {
      return this.getById(this.$route.params.id)
    },
    fullAssessment() {
      return this.getFullById(this.$route.params.id)
    },
    category() {
      if (this.fullAssessment) {
        return this.categories[this.fullAssessment.challenge]
      }
      return false;
    },
    rationaleRequired() {
      return this.review
    },
    navigationAvailable() {
      if (this.review) {
        if (this.debouncedRationale) {
          if (this.debouncedRationale.length > 0) {
            return true
          }
        }
        return false
      }
      return true
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
        setTimeout(() => this.saveStatus = 'Saved', 0)
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
        this.saveStatus = 'Saved'
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
  .b-tooltip {
    width: 50%;
  }
}
.custom-card {
  padding-bottom: 60px;
}
.larger-tooltip {
  .tooltip-content {
    width: 500px;
  }
}
.link-disabled {
  pointer-events: none;
  opacity: 0.5;
}
</style>
<style lang="scss">
.larger-tooltip .tooltip-content {
  width: 500px !important;
  max-width: 100vw !important;
}
</style>
