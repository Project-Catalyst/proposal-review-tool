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
            @click="showList = !showList"
            >{{ showListLabel }}</b-button
          >
        </div>
      </div>
      <div class="assessments-list" v-if="showList">
        <assessment-preview
          v-for="(assessment, idx) in renderedList"
          :key="`ass-${assessment.id}`"
          :idx="idx"
          :assessment="assessment"
        />
        <div
          class="button"
          @click="currentSlice = currentSlice + 100"
          v-if="currentSlice < currentList.length"
        >
          Load more...
        </div>
      </div>
    </section>
    <router-view class="sub-view" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import shuffle from "@/utils/shuffle";
import AssessmentPreview from "@/components/AssessmentPreview";
import CFilter from "@/views/CFilter";
import { EventBus } from "./../EventBus";
import proposals from "../assets/data/proposals.json";
import assessors from "../assets/data/assessors.json";
import originalAssessments from "../assets/data/assessments.csv";

export default {
  name: "Conditions",
  components: {
    AssessmentPreview,
    CFilter,
  },
  data() {
    return {
      originalAssessments: originalAssessments,
      proposals: proposals,
      assessors: assessors,
      prefilters: [
        { label: "Random", v: "randomAssessments" },
        { label: "Low reviewed (from other vCAs)", v: "lowReviewed" },
        { label: "No reviews (from other vCAs)", v: "noReviewed" },
        { label: "All", v: "filteredAssessments" },
      ],
      activeFilters: [],
      currentPrefilter: false,
      currentList: [],
      currentIndex: 0,
      currentSlice: 100,
      showList: false,
      prefilter: "filteredAssessments",
      interval: false
    };
  },
  computed: {
    ...mapState({
      assessments: (state) => state.assessments.indexed,
      listAssessments: (state) => state.assessments.all
    }),
    fullAssessments() {
      const localAssessments = this.assessments
      let fullAssessments = this.originalAssessments.map(item => ({
        ...item,
        ...localAssessments[item.id],
      }));
      return fullAssessments.filter(
        (el) => (!el.blank)
      );
    },
    filteredAssessments() {
      return this.activeFilters.length
        ? this.customFilter(this.fullAssessments, this.activeFilters)
        : this.fullAssessments;
    },
    randomAssessments() {
      return shuffle(this.filteredAssessments);
    },
    lowReviewed() {
      return this.filteredAssessments
        .filter((el) => el.reviews <= 4)
        .sort((a, b) => a.reviews - b.reviews);
    },
    noReviewed() {
      return this.filteredAssessments.filter(
        (el) => (el.reviews === 0) || (!el.reviews)
      );
    },
    renderedList() {
      return this.currentList.slice(0, this.currentSlice);
    },
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
          comparision: (a, v) => parseInt(a) === parseInt(v),
          value: false,
          values: this.proposalsById,
        }
      };
    },
    showListLabel() {
      return (this.showList) ? 'Close list' : 'Show list'
    }
  },
  methods: {
    setList(el) {
      this.currentSlice = 100;
      this.currentIndex = 0;
      this.currentPrefilter = el;
      this.currentList = this[el.v];
    },
    updateList() {
      this.currentList = this[this.currentPrefilter.v];
    },
    getNext() {
      this.$router.push({
        name: "assessment",
        params: { id: this.currentList[this.currentIndex].id },
      });
      this.currentIndex = this.currentIndex + 1;
    },
    setNext(index) {
      this.currentIndex = index + 1;
    },
    updateFilter(prop, value) {
      const newFilter = Object.assign({}, prop);
      newFilter.value = value;
      this.activeFilters.push(newFilter);
      this.setList(this.currentPrefilter);
    },
    removeFilter(f) {
      const idx = this.activeFilters.indexOf(f);
      if (idx > -1) {
        this.activeFilters.splice(idx, 1);
        this.setList(this.currentPrefilter);
      }
    },
    customFilter(data, filters) {
      const [current, ...newFilters] = filters;
      const filtered = data.filter((el) =>
        current.comparision(current.value, el[current.key], el)
      );
      if (filters.length > 1) {
        return this.customFilter(filtered, newFilters);
      } else {
        return filtered;
      }
    },

  },
  mounted() {
    this.setList({ label: "All", v: "filteredAssessments" });
    EventBus.$on("next-assessment", this.getNext);
    EventBus.$on("set-assessment-index", this.setNext);
    EventBus.$on("update-list", this.updateList);
  },
  destroyed() {
    EventBus.$off("next-assessment");
    EventBus.$off("set-assessment-index");
    EventBus.$off("update-list");
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
