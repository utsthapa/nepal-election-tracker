import PollsPageClient from './PollsPageClient'
import { getLatestPolls, getPollTrends } from '../../data/polls'

export const metadata = {
  title: 'Polls | NepaliSoch',
  description: 'Latest public opinion polls and polling trends for Nepal elections.',
}

export default function PollsPage() {
  const polls = getLatestPolls(20)
  const trends = getPollTrends()

  return <PollsPageClient polls={polls} trends={trends} />
}
