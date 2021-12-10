import originalAssessments from "@/assets/data/assessments.csv"
import comparisons from "@/utils/comparisons"

// initial state
const getDefaultState = () => ({
  all: [],
  indexed: {},
  activeFilters: [],
  activePrefilter: {label: "All", v: 'std'},
  currentIndex: 0,
  currentSlice: 100
})


const state = getDefaultState()

// getters
const getters = {
  getById: (state) => (id) => {
    return state.indexed[id]
  },
  fullAssessments: (state) => {
    let fullAssessments = originalAssessments.map(item => ({
      ...item,
      ...state.indexed[item.id],
    }));
    return fullAssessments.filter(
      (el) => (!el.blank)
    );
  },
  filteredAssessments: (state, _, rootState, rootGetters) => {
    let filtered = rootGetters['assessments/fullAssessments']
    state.activeFilters.forEach((current) => {
      filtered = filtered.filter((el) =>
        comparisons[current.comparison](current.value, el[current.key], el)
      )
    })
    return comparisons[state.activePrefilter.v](filtered)
  },
  renderedList: (state, _, rootState, rootGetters) => {
    return rootGetters['assessments/filteredAssessments'].slice(0, state.currentSlice)
  },
  filteredCount: (state, _, rootState, rootGetters) => {
    return rootGetters['assessments/filteredAssessments'].length
  }
}

// actions
const actions = {
}

// mutations
const mutations = {
  setAssessments (state, assessments) {
    state.all = assessments
    this.commit('assessments/setIndexed', assessments)
  },
  setIndexed (state, assessments) {
    let result = {}
    assessments.forEach(el => {

      result[el.id] = el
    })
    state.indexed = result
  },
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  setReview(state, data) {
    const assessment = state.all.find(a => parseInt(a.id) === parseInt(data.id));
    if (assessment) {
      assessment.not_valid = data.value;
    }
  },
  setRationaleReview(state, data) {
    const assessment = state.all.find(a => parseInt(a.id) === parseInt(data.id));
    if (assessment) {
      assessment.not_valid_rationale = data.value;
    }
  },
  addFilter(state, {prop, value}) {
    const newFilter = Object.assign({}, prop);
    newFilter.value = value;
    state.activeFilters.push(newFilter);
  },
  setPrefilter(state, newPrefilter) {
    state.activePrefilter = newPrefilter
  },
  removeFilter(state, f) {
    const idx = state.activeFilters.indexOf(f);
    if (idx > -1) {
      state.activeFilters.splice(idx, 1);
    }
  },
  setIndex(state, index) {
    state.currentIndex = index
  },
  setSlice(state, slice) {
    state.currentSlice = slice
  },
  incrementIndex(state) {
    state.currentIndex = state.currentIndex + 1
  },
  incrementSlice(state) {
    state.currentSlice = state.currentSlice + 100
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
