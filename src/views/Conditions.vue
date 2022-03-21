<template>
  <div class="conditions container">
    <section>
      <div class="filters p-4">
        <c-filter
          :filterVisible="'true'"
          :activeFilters="activeFilters"
          :availableFilters="availableFilters"
          @remove-filter="removeFilter"
          @update-filter="updateFilter"
        />
      </div>
      <div class="notification is-primary mb-6">
        <div class="buttons">
          <b-button type="is-primary" inverted @click="getNext">Next</b-button>
          <b-button
            type="is-primary"
            inverted
            outlined
            @click="toggleList"
            >{{ showListLabel }}</b-button
          >
          <b-button type="is-primary" 
            inverted
            outlined 
            @click="exportButton">Export</b-button>
        </div>
      </div>
      <div class="assessments-list" v-if="listVisible">
        <assessment-preview
          v-for="(assessment, idx) in renderedList"
          :key="`ass-${assessment.id}`"
          :idx="idx"
          :assessment="assessment"
        />
        <div
          class="button"
          @click="incrementSlice"
          v-if="currentSlice < filteredCount"
        >
          Load more...
        </div>
      </div>
    </section>
    <router-view class="sub-view" />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import AssessmentPreview from "@/components/AssessmentPreview";
import CFilter from "@/views/CFilter";
import proposals from "../assets/data/proposals.json";

export default {
  name: "Conditions",
  components: {
    AssessmentPreview,
    CFilter,
  },
  data() {
    return {
      proposals: proposals,
      showList: false,
      interval: false
    };
  },
  computed: {
    ...mapState({
      assessments: (state) => state.assessments.indexed,
      listAssessments: (state) => state.assessments.all,
      activeFilters: (state) => state.assessments.activeFilters,
      activePrefilter: (state) => state.assessments.activePrefilter,
      currentIndex: (state) => state.assessments.currentIndex,
      currentSlice: (state) => state.assessments.currentSlice,
      listVisible: (state) => state.assessments.listVisible
    }),
    ...mapGetters("assessments", ["renderedList", "filteredCount"]),
    proposalsById() {
      return this.proposals.reduce(
        (obj, item) => Object.assign(obj, { [item.title]: item.id }),
        {}
      );
    },
    availableFilters() {
      return {
        proposal_id: {
          key: "proposal_id",
          label: "Proposal",
          comparison: 'sameInt',
          value: false,
          values: this.proposalsById,
        }
      };
    },
    showListLabel() {
      return (this.listVisible) ? 'Close list' : 'Show list'
    }
  },
  methods: {
    setList() {
      this.$store.commit('assessments/setSlice', 100)
      this.$store.commit('assessments/setIndex', 0)
    },
    getNext() {
      this.$store.dispatch('assessments/getNext')
    },
    exportButton() {
      alert('! Function not implemented')
    },
    incrementSlice() {
      this.$store.commit('assessments/incrementSlice')
    },
    updateFilter(prop, value) {
      this.$store.commit('assessments/addFilter', {
        prop,
        value
      })
      this.setList();
    },
    removeFilter(f) {
      this.$store.commit('assessments/removeFilter', f)
      this.setList();
    },
    toggleList() {
      this.$store.commit('assessments/toggleList')
    }

  },
  mounted() {
    // this.setList();
  },
  destroyed() {
  }
};
</script>
<style lang="scss" scoped>
.conditions {
  display: flex;
  flex-direction: column;
  .assessments-list {
    flex-grow: 1;
    //overflow: auto;
  }
}
</style>
