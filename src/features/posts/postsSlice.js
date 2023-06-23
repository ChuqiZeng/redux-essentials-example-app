import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../api/client'

const initialState = {
  status: 'idle', // 'loading', 'succeeded', or 'failed'
  error: null, // string
  posts: [],
}

// Selectors
// It would be nice if we didn't have to keep rewriting our components
// every time we made a change to the data format in our reducers.
// One way to avoid this is to define reusable selector functions in the slice files,
// and have the components use those selectors to extract the data they need
// instead of repeating the selector logic in each component.
// That way, if we do change our state structure again,
//we only need to update the code in the slice file.
export const selectAllPosts = (state) => state.posts.posts

export const selectPostById = (state, postId) =>
  state.posts.posts.find((post) => post.id === postId)

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
      const existingPost = state.posts.find((post) => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.posts.find((post) => post.id === postId)
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
        state.posts = state.posts.concat(action.payload)
        state.status = 'succeeded'
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.posts.push(action.payload)
      })
  },
})

export const { postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer
