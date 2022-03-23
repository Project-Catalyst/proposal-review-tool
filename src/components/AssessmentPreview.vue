<template>
  <div
    class="assessment-preview columns is-multiline is-mobile"
    >
    <div class="info column is-one-quarter">
      <div class="label mr-2">Proposal:</div>
      <div class="value">{{proposal.title}}</div>
    </div>
    <div class="info column is-one-quarter">
      <div class="label mr-2">Average Rating: </div>
      <div class="value">
        <b-rate v-model="rating" disabled />
      </div>
    </div>
    <div class="info column is-one-quarter">
      <div class="label mr-2">Assessor:</div>
      <div class="value">{{assessment.assessor}}</div>
    </div>
    <div class="info column is-one-quarter">
      <b-checkbox
        class="always-opaque mb-3"
        v-model="assessment.not_valid"
        type="is-warning"
        disabled>
        Filtered out
      </b-checkbox>
    </div>
    <div class="info mt-3 column is-full">
      <b-button
        class="mr-6"
        type="is-primary"
        @click="goTo"
      >
        Open</b-button>
    </div>
  </div>
</template>

<script>

import proposals from '../assets/data/proposals.json'

export default {
  data() {
    return {
      proposals: proposals,
    }
  },
  name: 'AssessmentPreview',
  props: ['assessment', 'idx'],
  computed: {
    proposal() {
      if (this.assessment) {
        let filtered = this.proposals.filter(p => (p.id === parseInt(this.assessment.proposal_id)))
        if (filtered.length) {
          return filtered[0]
        }
      }
      return false
    },
    rating() {
      return Math.round((this.assessment.auditability_rating + this.assessment.feasibility_rating + this.assessment.impact_rating) / 3)
    }
  },
  methods: {
    goTo() {
      this.$store.dispatch('assessments/goTo', {
        newId: this.assessment.id,
        newIdx: this.idx + 1
      })
    }
  }
}
</script>

<style lang="scss">
.assessment-preview {
  padding: 10px;
  width: 100%;
  &:nth-child(2n + 1) {
    background: #f5f5f5;
  }
  .info {
    display: flex;
    padding: 5px 5px 0 5px !important;
    box-sizing: border-box !important;
    .label {
      font-weight: bold;
      margin-bottom: 0 !important;
    }
    &.text {
      flex-wrap: wrap;
      .value {
        width: 100%;
        font-size: 13px;
      }
    }
  }
  .always-opaque {
    opacity: 1 !important;
  }
}
</style>
