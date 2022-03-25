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
<<<<<<< HEAD
      const assessmentsExport = this.assessments.map(item => ({
=======
      const assessmentsExport = this.downloadAssessments.map(item => ({
>>>>>>> 44db49f9259acdb9b5ae9d85a7808c60aa0e7df5
        ...originalAssessmentsIndexed[item.id],
        ...item,
      }));
      downloadCsv(assessmentsExport, this.profile.info.name)
    }
  },
}

export default download
