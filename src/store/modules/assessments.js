// initial state
const getDefaultState = () => ({
  all: [],
  indexed: {}
})


const state = getDefaultState()

// getters
const getters = {
  getById: (state) => (id) => {
    return state.indexed[id]
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
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
