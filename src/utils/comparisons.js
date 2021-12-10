import shuffle from '@/utils/shuffle'

const comparisions = {
  sameInt: (a, v) => parseInt(a) === parseInt(v),
  random: (l) => shuffle(l),
  lowReviewed: (l) => l.filter((el) => el.reviews <= 4)
    .sort((a, b) => a.reviews - b.reviews),
  noReviewed: (l) => l.filter((el) => (el.reviews === 0) || (!el.reviews)),
  std: (l) => l
}

export default comparisions
