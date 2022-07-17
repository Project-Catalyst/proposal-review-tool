import { mapState } from "vuex";
import downloadCsv from "@/utils/export-csv";
import originalAssessments from "@/assets/data/assessments.csv";

const download = {
  data() {
    return {
      originalAssessments: originalAssessments
    }
  },
  computed: {
    ...mapState({
      profile: (state) => state.profile,
      downloadAssessments: (state) => state.assessments.all,
    })
  },
  methods: {
    exportCsv() {
      let originalAssessmentsIndexed = {}
      this.originalAssessments.forEach(el => {
        originalAssessmentsIndexed[el.id] = el
      })
      const assessmentsExport = this.downloadAssessments.map((item) => {
        let newItem = {
          ...originalAssessmentsIndexed[item.id],
          ...item,
        };
        if (!Object.prototype.hasOwnProperty.call(newItem, 'not_valid')) {
          newItem['not_valid'] = false
        }
        return newItem;
      })
      downloadCsv(assessmentsExport, this.profile.info.name)
    }
  },
}

export default download
