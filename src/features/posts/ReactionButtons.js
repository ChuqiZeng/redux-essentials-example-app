import React from 'react'
import { useAddReactionMutation } from '../api/apiSlice'

const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
}

export const ReactionButtons = ({ post }) => {
  const [addReaction] = useAddReactionMutation()
  const reactionButtons = Object.entries(reactionEmoji).map(
    ([emojiName, emoji]) => (
      <button
        key={emojiName}
        type="button"
        className="muted-button reaction-button"
        onClick={() => {
          addReaction({ postId: post.id, reaction: emojiName})
        }}
      >
        {emoji} {post.reactions[emojiName]}
      </button>
    )
  )

  return <div>{reactionButtons}</div>
}
