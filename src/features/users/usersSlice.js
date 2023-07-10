import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from '../api/apiSlice'

const usersAdapter = createEntityAdapter()

const initialState = usersAdapter.getInitialState()

// Injecting endpoints to split API slice
// injectEndpoints() mutates the original API slice object
// to add the additional endpoint definitions, and then returns it. 
export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query({
      query: () => '/users',
      transformResponse: responseData => {
        return usersAdapter.setAll(initialState, responseData)
      }
    })
  })
})

export const { useGetUsersQuery } = extendedApiSlice

// Calling 'someEndpoint.select(someArg)' generate a new selector that
// will return the query result object for a query with those parameters.
// To generate a selector for a specific query argument,
// call 'select(theQueryArg)'.
// In this case, the users query has no params, so we don't pass args
export const selectUsersResult = extendedApiSlice.endpoints.getUsers.select()

const selectUsersData = createSelector(
  selectUsersResult,
  usersResult => usersResult.data
)

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)
