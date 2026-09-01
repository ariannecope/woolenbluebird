export const STORY_TYPE_LABELS = {
  INTERVIEW: 'Interview',
  ESSAY: 'Essay',
  MAKER_PROFILE: 'Maker Profile',
  PODCAST: 'Podcast',
  JOURNAL: 'Journal',
}

// Journal isn't included here: it's Arianne's personal writing, not a
// filterable type within Made Whole's wider-community story collection —
// it has its own page/section instead (see Journal.jsx).
export const STORY_TYPE_FILTERS = [
  { value: '', label: 'All Stories' },
  { value: 'interview', label: 'Interviews' },
  { value: 'essay', label: 'Essays' },
  { value: 'maker_profile', label: 'Maker Profiles' },
  { value: 'podcast', label: 'Podcast' },
]
