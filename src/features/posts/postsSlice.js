import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { client } from '../../api/client'

// Use createEntityAdapter to create an entity adapter for creating the state
// with normalization, and other useful reducers and selectors
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => {
    b.date.localeCompare(a.date)
  }
})

const initialState = postsAdapter.getInitialState({
  status: 'idle', // 'loading', 'succeeded', or 'failed'
  error: null, // string
})

// Thunk
// createAsyncThunk(
// prefix string for the generated action types,
// payload creator callback function that
// return a Promise containing some data, or a rejected Promise with an error)
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data
})

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (initialPost) => {
    const response = await client.post('/fakeApi/posts', initialPost)
    return response.data
  }
)

// create the slice with reducer functions
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      const existingPost = state.entities[id]
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.entities[postId]
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Add any fetched posts to the state
        // use 'upsertMany' reducer from postsAdapter to mutate the state
        postsAdapter.upsertMany(state, action.payload)
        
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(addNewPost.fulfilled,
        // Add the new created post to the state
        // use 'addOne' reducer from postsAdapter directly
        postsAdapter.addOne
      )
  },
})

export const { postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

// Selectors
// Export the customized selectors for this adapter using `getSelectors`
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.posts)


// Memoized selectors
export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => {
    return posts.filter(post =>post.user === userId)
  }
)