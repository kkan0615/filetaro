import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DeleteSetting, DeleteSettingUpdate } from '@renderer/types/models/delete'

const name = 'deletes'

export interface DeleteState {
  setting: DeleteSetting
  directoryPath: string
  isRecursive: boolean
}

const initialState: DeleteState = {
  setting: {
    isDefaultRecursive: false,
    isDefaultOpenCard: false,
  },
  directoryPath: '',
  isRecursive: false
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
    setDeleteIsRecursive: (state, action: PayloadAction<boolean>) => {
      state.isRecursive = action.payload
    },
    clearDeleteSlice: (state) => {
      state.setting = {
        isDefaultRecursive: false,
        isDefaultOpenCard: false,
      }
      state.directoryPath = ''
      state.isRecursive = false
    }
  },
})

// this is for dispatch
export const {
  setDeleteSetting,
  setDeleteDirectoryPath,
  setDeleteIsRecursive,
  clearDeleteSlice,
} = deleteSlice.actions

// this is for configureStore
export default deleteSlice.reducer
