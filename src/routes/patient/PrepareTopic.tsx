import { Link, useParams } from 'react-router-dom'
import { prepareTopics } from '../../data/prepareTopics'

export default function PrepareTopic() {
  const { topicId } = useParams()
  const topic = prepareTopics.find((t) => t.id === topicId)

  if (!topic) {
    return (
      <div className="px-5 py-2">
        <p className="text-sm text-ink-500">Guide not found.</p>
        <Link to="/patient/prepare" className="mt-2 inline-block text-sm text-terracotta-600">
          ← Back to guides
        </Link>
      </div>
    )
  }

  return (
    <div className="px-5 py-2">
      <Link to="/patient/prepare" className="text-sm text-ink-500 hover:text-terracotta-600">
        ← How to prepare for
      </Link>
      <h1 className="mt-2 text-xl font-semibold text-ink-900">{topic.title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-700">{topic.body}</p>
    </div>
  )
}
