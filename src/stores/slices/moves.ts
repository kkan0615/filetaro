import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TargetFile } from '@renderer/types/models/targetFile'
import { MoveDirectory, MoveSetting } from '@renderer/types/models/move'
import { NO_SLIDE_INDEX } from '@renderer/types/models/slide'

const name = 'moves'

export interface MoveState {
  setting: MoveSetting
  moveDirectories: MoveDirectory[]
  targetFiles: TargetFile[]
  movesSlideIndex: number
  isBlockKey: boolean // block to listen keyup
}

const initialState: MoveState = {
  setting: {
    isAutoDuplicatedName: false,
    isKeepOriginal: false,
    isDefaultCheckedOnLoad: false,
    isNotFirstPage: false,
    isNotFirstLoad: false,
    isAutoPlay: false,
  },
  moveDirectories: [],
  targetFiles: [],
  movesSlideIndex: NO_SLIDE_INDEX,
  isBlockKey: false
}

export const moveSlice = createSlice({
  name,
  initialState,
  reducers: {
    setMoveSetting: (state, action: PayloadAction<Partial<MoveSetting>>) => {
      state.setting = {
        ...state.setting,
        ...action.payload
      }
    },
    setMoveIsBlockKey: (state, action: PayloadAction<boolean>) => {
      state.isBlockKey = action.payload
    },
    addMoveDirectory: (state, action: PayloadAction<MoveDirectory>) => {
      state.moveDirectories = [...state.moveDirectories, action.payload]
    },
    updateMoveDirectoryByPath: (state, action: PayloadAction<MoveDirectory>) => {
      state.moveDirectories = state.moveDirectories.map(moveDirectoryEl => {
        if (moveDirectoryEl.path === action.payload.path) {
          return action.payload
        }

        return moveDirectoryEl
      })
    },
    removeMoveDirectory: (state, action: PayloadAction<MoveDirectory>) => {
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
        isNotFirstPage: false,
        isNotFirstLoad: false,
        isAutoPlay: false,
      }
      state.moveDirectories = []
      state. targetFiles = []
      state.movesSlideIndex= -1
      state.isBlockKey = false
    }
  },
})

// this is for dispatch
export const {
  setMoveSetting,
  setMoveIsBlockKey,
  addMoveDirectory,
  updateMoveDirectoryByPath,
  removeMoveDirectory,
  addTargetFile,
  removeTargetFile,
  updateTargetFileCheckByIndex,
  setMovesSlideIndex,
  clearMoveSlice,
} = moveSlice.actions

// this is for configureStore
export default moveSlice.reducer
