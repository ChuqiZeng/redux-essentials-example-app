// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define our single API slice object
export const apiSlice = createApi({
    // The cache reducer expects to be added to 'state.api' (alread default - thi is optional)
    reducerPath: 'api',
    // All of our requests will have URLs starting with '/fakeApi'
    baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
    // A root tagTypes field, declare an array of string tag names
    // for data types
    tagTypes: ['Post'],
    // The "endpoints" represent operations and requests for this server
    endpoints: builder => ({
        // The 'getPosts' endpoint is a "query" operation that returns data
        getPosts: builder.query({
            // The URL for the request is '/fakeApi/posts'
            query: () => '/posts',
            // An array that lists a set of tags
            // describing the data in this query
            providesTags: (result = [], error, arg) => [
                'Post',
                ...result.map(({ id }) => ({type: 'Post', id}))
            ]
        }),
        getPost: builder.query({
            query: postId => `/posts/${postId}`,
            providesTags: (result, error, arg) => [{
                type: 'Post',
                id: arg
            }]
        }),
        addNewPost: builder.mutation({
            query: initialPost => ({
                url: '/posts',
                method: 'POST',
                // Include the entire post object as the request body
                body: initialPost
            }),
            // An array that lists a set of tags that turns invalidate
            // every time this mutation runs
            invalidatesTags: ['Post']
        }),
        editPost: builder.mutation({
            query: post => ({
                url: `/posts/${post.id}`,
                method: 'PATCH',
                body: post
            }),
            invalidatesTags: (result, error, arg) => [{
                type: 'Post',
                id: arg.id
            }]
        }),
        addReaction: builder.mutation({
            query: ({ postId, reaction }) => ({
                url: `posts/${postId}/reactions`,
                method: 'POST',
                // In a real app, we'd probably need to base this on userID
                // so that a user can't do the same reaction more than once
                body: { reaction }
            }),
            async onQueryStarted({ postId, reaction }, { dispatch, queryFulfilled }) {
                // `updateQueryData` requires the endpoint name and cache key arguments,
                // so it knows which piece of cache state to update
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getPosts', undefined, draft => {
                        // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
                        const post = draft.find(post => post.id === postId)
                        if (post) {
                            post.reactions[reaction]++
                        }
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            }
        })
    })
})

// Export the auto-generated hook for the 'getPosts' query endpoint
export const {
    useGetPostsQuery,
    useGetPostQuery,
    useAddNewPostMutation,
    useEditPostMutation,
    useAddReactionMutation
} = apiSlice