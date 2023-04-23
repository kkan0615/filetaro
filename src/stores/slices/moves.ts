import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TargetFile } from '@renderer/types/models/targetFile'
import { Move, MoveSetting, MoveSettingUpdate } from '@renderer/types/models/move'

const name = 'moves'

export interface MoveState {
  setting: MoveSetting
  moveDirectories: Move[]
  targetFiles: TargetFile[]
  movesSlideIndex: number
}

const initialState: MoveState = {
  setting: {
    isAutoDuplicatedName: false,
    isKeepOriginal: false,
    isDefaultCheckedOnLoad: false,
  },
  moveDirectories: [],
  targetFiles: [],
  movesSlideIndex: -1,
}

export const moveSlice = createSlice({
  name,
  initialState,
  reducers: {
    setMoveSetting: (state, action: PayloadAction<MoveSettingUpdate>) => {
      state.setting = {
        ...state.setting,
        ...action.payload
      }
    },
    addMoveDirectory: (state, action: PayloadAction<Move>) => {
      state.moveDirectories = [...state.moveDirectories, action.payload]
    },
    removeMoveDirectory: (state, action: PayloadAction<Move>) => {
      state.moveDirectories = state.moveDirectories.filter(
        (directoryEl) => directoryEl.path !== action.payload.path
      )
    },
    addTargetFile: (state, action: PayloadAction<TargetFile>) => {
      if (
        state.targetFiles.findIndex((targetFileEl) => targetFileEl.path === action.payload.path) !==
        -1
      )
        return
      state.targetFiles = [...state.targetFiles, action.payload]
    },
    removeTargetFile: (state, action: PayloadAction<string>) => {
      state.targetFiles = state.targetFiles.filter(
        (targetFileEl) => targetFileEl.path !== action.payload
      )
    },
    updateTargetFileCheckByIndex(
      state,
      action: PayloadAction<{ index: number; isCheck: boolean }>
    ) {
      const newTargetFiles = [...state.targetFiles]
      newTargetFiles[action.payload.index].checked = action.payload.isCheck
      state.targetFiles = newTargetFiles
    },
    setMovesSlideIndex: (state, action: PayloadAction<number>) => {
      state.movesSlideIndex = action.payload
    },
    clearMoveSlice: (state) => {
      state.setting = {
        isAutoDuplicatedName: false,
        isKeepOriginal: false,
        isDefaultCheckedOnLoad: false,
      }
      state.moveDirectories = []
      state. targetFiles = []
      state.movesSlideIndex= -1
    }
  },
})

// this is for dispatch
export const {
  setMoveSetting,
  addMoveDirectory,
  removeMoveDirectory,
  addTargetFile,
  removeTargetFile,
  updateTargetFileCheckByIndex,
  setMovesSlideIndex,
  clearMoveSlice,
} = moveSlice.actions

// this is for configureStore
export default moveSlice.reducer
