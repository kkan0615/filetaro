// https://redux-toolkit.js.org/tutorials/quick-start
// https://dev.to/raaynaldo/redux-toolkit-setup-tutorial-5fjf
// https://kyounghwan01.github.io/blog/React/redux/redux-toolkit/#reselect
import { configureStore } from '@reduxjs/toolkit'
import applicationReducer from './slices/application'
import movesReducer from './slices/moves'
import renamesReducer from './slices/renames'
import organizesReducer from './slices/organizes'
import deletesReducer from './slices/deletes'

const store = configureStore({
  reducer: {
    applications: applicationReducer,
    moves: movesReducer,
    renames: renamesReducer,
    organizes: organizesReducer,
    deletes: deletesReducer
  },
  devTools: true,
})

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
