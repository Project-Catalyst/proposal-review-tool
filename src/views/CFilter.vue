<template>
  <section class="filter pt-4 pb-4">
    <div class="filter-list box" v-if="filterVisible">
      <div
        class="single-filter is-expanded"
        v-for="(v, i) in availableFilters"
        :key="`filter-${v.key}-${i}`"
      >
        <b-field expanded :label="v.label">
          <b-autocomplete
              v-model="search"
              :data="filteredDataArray(v.values)"
              placeholder="Search Proposals"
              icon="magnify"
              :open-on-focus="true"
              clearable
              @select="option => updateAutocomplete(option, v)">
              <template #empty>No results found</template>
          </b-autocomplete>
        </b-field>
      </div>
    </div>
    <div class="active-filters box" v-if="activeFilters.length">
      <div class="heading">Selected filters:</div>
      <div class="tags">
        <div
          class="tag is-primary is-light"
          v-for="f in activeFilters"
          :key="`active-${f.key}-${f.value}`"
        >
          <span class="has-ellipsis">{{ f.label }}: {{ getLabelValue(f) }}</span>
          <button class="delete" @click="removeFilter(f)"></button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "CFilter",
  data() {
    return {
      search: ''
    }
  },
  props: ["availableFilters", "activeFilters", "filterVisible"],
  methods: {
    updateFilter(prop, value) {
      this.$emit("update-filter", prop, value);
    },
    removeFilter(f) {
      this.$emit("remove-filter", f);
    },
    getLabelValue(f) {
      return Object.keys(f.values)
        .find((key) => f.values[key] === f.value)
    },
    filteredDataArray(values) {
      return Object.keys(values).filter((option) => {
        return option
            .toString()
            .toLowerCase()
            .indexOf(this.search.toLowerCase()) >= 0
      })
    },
    updateAutocomplete(option, v) {
      if (option) {
        this.updateFilter(v, v.values[option])
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.tag .has-ellipsis {
  max-width: calc(100vw - 110px);
}
</style>
