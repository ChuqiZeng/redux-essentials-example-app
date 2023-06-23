import React from 'react'
import { useDispatch } from 'react-redux'
import { reactionAdded } from './postsSlice'

const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
}

export const ReactionButtons = ({ post }) => {
  const dispatch = useDispatch()

  const onReactionClicked = (emojiName) => {
    dispatch(
      reactionAdded({
        postId: post.id,
        reaction: emojiName,
      })
    )
  }
  const reactionButtons = Object.entries(reactionEmoji).map(
    ([emojiName, emoji]) => (
      <button
        key={emojiName}
        type="button"
        className="muted-button reaction-button"
        onClick={() => onReactionClicked(emojiName)}
      >
        {emoji} {post.reactions[emojiName]}
      </button>
    )
  )

  return <div>{reactionButtons}</div>
}
