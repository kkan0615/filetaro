import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TargetFiles, UpdateTargetFiles } from '@renderer/types/models/targetFiles'
import { OrganizeSetting, OrganizeSettingUpdate } from '@renderer/types/models/organize'

const name = 'organizes'

export interface OrganizeState {
  setting: OrganizeSetting
  targetFiles: TargetFiles[]
  directoryPath: string
}

const initialState: OrganizeState = {
  setting: {
    isAutoDuplicatedName: false,
    isKeepOriginal: false,
    isDefaultOpenCard: false,
    isDefaultCheckedOnLoad: false,
    isOverrideDirectory: false,
  },
  targetFiles: [],
  directoryPath: '',
}

export const moveSlice = createSlice({
  name,
  initialState,
  reducers: {
    setOrganizeSetting: (state, action: PayloadAction<OrganizeSettingUpdate>) => {
      state.setting = {
        ...state.setting,
        ...action.payload
      }
    },
    addOrganizeTargetFile: (state, action: PayloadAction<TargetFiles>) => {
      if (state.targetFiles.findIndex((targetFileEl) => targetFileEl.path === action.payload.path) !== -1) return
      state.targetFiles = [...state.targetFiles, action.payload]
    },
    updateOrganizeTargetFile: (state, action: PayloadAction<{path: string, newData: UpdateTargetFiles }>) => {
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
    updateOrganizeTargetFileCheckByIndex(
      state,
      action: PayloadAction<{ index: number; isCheck: boolean }>
    ) {
      const newTargetFiles = [...state.targetFiles]
      newTargetFiles[action.payload.index].checked = action.payload.isCheck
      state.targetFiles = newTargetFiles
    },
    removeOrganizeTargetFileByPath: (state, action: PayloadAction<string>) => {
      state.targetFiles = state.targetFiles.filter(
        (targetFileEl) => targetFileEl.path !== action.payload
      )
    },
    setOrganizeDirectoryPath: (state, action: PayloadAction<string>) => {
      state.directoryPath = action.payload
    },
    clearOrganizeSlice: (state) => {
      state.setting = {
        isAutoDuplicatedName: false,
        isKeepOriginal: false,
        isDefaultOpenCard: false,
        isDefaultCheckedOnLoad: false,
        isOverrideDirectory: false,
      }
      state.targetFiles = []
      state.directoryPath = ''
    }
  },
})

// this is for dispatch
export const {
  setOrganizeSetting,
  addOrganizeTargetFile,
  updateOrganizeTargetFile,
  updateOrganizeTargetFileCheckByIndex,
  removeOrganizeTargetFileByPath,
  setOrganizeDirectoryPath,
  clearOrganizeSlice,
} = moveSlice.actions

// this is for configureStore
export default moveSlice.reducer
