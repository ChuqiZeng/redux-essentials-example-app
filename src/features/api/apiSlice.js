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
        })
    })
})

// Export the auto-generated hook for the 'getPosts' query endpoint
export const {
    useGetPostsQuery,
    useGetPostQuery,
    useAddNewPostMutation,
    useEditPostMutation
} = apiSlice