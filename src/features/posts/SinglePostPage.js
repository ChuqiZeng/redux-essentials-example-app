import React from 'react'

import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { Spinner } from '../../components/Spinner'

import { useGetPostQuery } from '../api/apiSlice'

export const SinglePostPage = ({ match }) => {
  const { postId } = match.params

  const {
    data: post,
    isFetching,
    isSuccess,
  } = useGetPostQuery(postId)

  let content

  if (isFetching) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    content =
      <article className="post">
        <h2>
          {post.title} <PostAuthor userId={post.user} />
        </h2>
        <TimeAgo timestamp={post.date} />
        <p className="post-content">{post.content}</p>
        <ReactionButtons post={post} />
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
      </article>
  }

  return (
    <section>
      {content}
    </section>
  )
}
