import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TargetFiles, UpdateTargetFiles } from '@renderer/types/models/targetFiles'
import { RenameSetting, RenameSettingUpdate } from '@renderer/types/models/rename'

const name = 'renames'

export interface RenameState {
  setting: RenameSetting
  targetFiles: TargetFiles[]
}

const initialState: RenameState = {
  setting: {
    isAutoDuplicatedName: false,
    isKeepOriginal: false,
    isDefaultOpenCard: false,
    isDefaultCheckedOnLoad: false,
  },
  targetFiles: [],
}

export const moveSlice = createSlice({
  name,
  initialState,
  reducers: {
    setRenameSetting: (state, action: PayloadAction<RenameSettingUpdate>) => {
      state.setting = {
        ...state.setting,
        ...action.payload
      }
    },
    addRenameTargetFile: (state, action: PayloadAction<TargetFiles>) => {
      if (state.targetFiles.findIndex((targetFileEl) => targetFileEl.path === action.payload.path) !== -1) return
      state.targetFiles = [...state.targetFiles, action.payload]
    },
    updateRenameTargetFile: (state, action: PayloadAction<{path: string, newData: UpdateTargetFiles }>) => {
      state.targetFiles = state.targetFiles.map(targetFileEl => {
        if (targetFileEl.path === action.payload.path) {
          return {
            ...targetFileEl,
            ...action.payload.newData,
          }
        }

        return targetFileEl
      })
    },
    updateRenameTargetFileCheckByIndex(
      state,
      action: PayloadAction<{ index: number; isCheck: boolean }>
    ) {
      const newTargetFiles = [...state.targetFiles]
      newTargetFiles[action.payload.index].checked = action.payload.isCheck
      state.targetFiles = newTargetFiles
    },
    removeRenameTargetFileByPath: (state, action: PayloadAction<string>) => {
      state.targetFiles = state.targetFiles.filter(
        (targetFileEl) => targetFileEl.path !== action.payload
      )
    },
    clearRenameSlice: (state) => {
      state.setting = {
        isAutoDuplicatedName: false,
        isKeepOriginal: false,
        isDefaultOpenCard: false,
        isDefaultCheckedOnLoad: false,
      }
      state.targetFiles = []
    }
  },
})

// this is for dispatch
export const {
  setRenameSetting,
  addRenameTargetFile,
  updateRenameTargetFile,
  updateRenameTargetFileCheckByIndex,
  removeRenameTargetFileByPath,
  clearRenameSlice,
} = moveSlice.actions

// this is for configureStore
export default moveSlice.reducer
