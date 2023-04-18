import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DeleteSetting, DeleteSettingUpdate } from '@renderer/types/models/delete'

const name = 'deletes'

export interface DeleteState {
  setting: DeleteSetting
  directoryPath: string
}

const initialState: DeleteState = {
  setting: {
    isDefaultRecursive: false,
    isDefaultOpenCard: false,
  },
  directoryPath: '',
}

export const deleteSlice = createSlice({
  name,
  initialState,
  reducers: {
    setDeleteSetting: (state, action: PayloadAction<DeleteSettingUpdate>) => {
      state.setting = {
        ...state.setting,
        ...action.payload
      }
    },
    setDeleteDirectoryPath: (state, action: PayloadAction<string>) => {
      state.directoryPath = action.payload
    },
    clearDeleteSlice: (state) => {
      state.setting = {
        isDefaultRecursive: false,
        isDefaultOpenCard: false,
      }
      state.directoryPath = ''
    }
  },
})

// this is for dispatch
export const {
  setDeleteSetting,
  setDeleteDirectoryPath,
  clearDeleteSlice,
} = deleteSlice.actions

// this is for configureStore
export default deleteSlice.reducer
