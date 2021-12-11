import Vue from "vue";
import originalAssessments from "@/assets/data/assessments.csv"
import comparisons from "@/utils/comparisons"
import router from '@/router'

// initial state
const getDefaultState = () => ({
  all: [],
  activeFilters: [],
  activePrefilter: {label: "All", v: 'std'},
  currentIndex: 0,
  currentSlice: 100
})


const state = getDefaultState()

// getters
const getters = {
  getById: (state, _, rootState, rootGetters) => (id) => {
    let filteredById = rootGetters['assessments/filteredById']
    return filteredById[id]
  },
  indexed: (state) => {
    let result = {}
    state.all.forEach(el => {
      result[el.id] = el
    })
    return result
  },
  fullAssessments: (state, _, rootState, rootGetters) => {
    const indexed = rootGetters['assessments/indexed']
    let fullAssessments = originalAssessments.map(item => ({
      ...item,
      ...indexed[item.id],
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
  filteredById: (state, _, rootState, rootGetters) => {
    let result = {}
    let filtered = rootGetters['assessments/filteredAssessments']
    filtered.forEach(el => {
      result[el.id] = el
    })
    return result
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
  getNext({ commit, state, getters }) {
    let fAssessments = getters.filteredAssessments
    if (fAssessments[state.currentIndex]) {
      let newId = fAssessments[state.currentIndex].id
      let currentId = false
      if (router.currentRoute.name === 'assessment') {
        currentId = router.currentRoute.params.id
      }
      if (newId !== currentId) {
        router.push({ name: 'assessment', params:{ id: newId }})
      }
      commit('incrementIndex')
    } else {
      commit('setIndex', 0)
    }
  },
  goTo({ commit }, {newId, newIdx}) {
    let currentId = false
    if (router.currentRoute.name === 'assessment') {
      currentId = router.currentRoute.params.id
    }
    if (newId !== currentId) {
      router.push({ name: 'assessment', params:{ id: newId }})
      commit('setIndex', newIdx)
    }
  }
}

// mutations
const mutations = {
  setAssessments (state, assessments) {
    state.all = assessments
  },
  resetState (state) {
    Object.assign(state, getDefaultState())
  },
  setReview(state, data) {
    const assessmentId = state.all.findIndex(a => parseInt(a.id) === parseInt(data.id));
    if (assessmentId != -1) {
      let assessment = {...state.all[assessmentId]}
      assessment.not_valid = data.value;
      Vue.set(state.all, assessmentId, assessment)
    }
  },
  setRationaleReview(state, data) {
    const assessmentId = state.all.findIndex(a => parseInt(a.id) === parseInt(data.id));
    if (assessmentId != -1) {
      let assessment = {...state.all[assessmentId]}
      assessment.not_valid_rationale = data.value;
      Vue.set(state.all, assessmentId, assessment)
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
