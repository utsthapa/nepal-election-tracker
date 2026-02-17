import { notFound } from 'next/navigation'

import PollPageClient from './PollPageClient'
import { getPollById, POLLS } from '../../../data/polls'

// Generate static params for all polls
export function generateStaticParams() {
  return POLLS.map((poll) => ({
    id: poll.id,
  }))
}

export async function generateMetadata({ params }) {
  const poll = getPollById(params.id)

  if (!poll) {
    return {
      title: 'Poll Not Found | NepaliSoch',
    }
  }

  const title = poll.titleNe ? `${poll.titleNe} | NepaliSoch` : `${poll.title} | NepaliSoch`

  return {
    title,
    description: poll.excerpt || poll.title,
  }
}

export default function PollPage({ params }) {
  const poll = getPollById(params.id)

  if (!poll) {
    notFound()
  }

  return <PollPageClient poll={poll} />
}
