import { configureStore } from '@reduxjs/toolkit'
import notificationsReducer from '../features/notifications/notificationsSlice'
import postsReducer from '../features/posts/postsSlice'
import { apiSlice } from '../features/api/apiSlice'

export default configureStore({
  reducer: {
    posts: postsReducer,
    notifications: notificationsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware)
})
