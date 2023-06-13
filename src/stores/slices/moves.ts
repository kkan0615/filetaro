import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TargetFile } from '@renderer/types/models/targetFile'
import { MoveDirectory, MoveSetting } from '@renderer/types/models/move'
import { NO_SLIDE_INDEX } from '@renderer/types/models/slide'
import dayjs from 'dayjs'
import { MoveSortType } from '@renderer/types/models/directory'

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
    sortMoveDirectories: (state, action: PayloadAction<MoveSortType>) => {
      const option = action.payload.slice(1)
      const sort = action.payload.charAt(0) as '+' | '-'
      if (!sort || !option) return

      if (option === 'createdAt') {
        state.moveDirectories.sort((a, b) => {
          const dayjsA = dayjs(a.createdAt)
          const dayjsB = dayjs(b.createdAt)
          if (sort === '+') return (dayjsA.isSameOrAfter(dayjsB) ? 1 : -1)

          return (dayjsA.isSameOrAfter(dayjsB) ? -1 : 1)
        })
      } else if (option === 'name') {
        state.moveDirectories.sort((a, b) => {
          const aName = a.path.split('\\').at(-1)
          const bName = b.path.split('\\').at(-1)
          if (!aName || !bName) return 0
          if (sort === '+') return aName.localeCompare(bName)

          return bName.localeCompare(aName)
        })
      } else if (option === 'path') {
        state.moveDirectories.sort((a, b) => {
          if (sort === '+') return a.path.localeCompare(b.path)

          return b.path.localeCompare(a.path)
        })
      }
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
  sortMoveDirectories,
  addTargetFile,
  removeTargetFile,
  updateTargetFileCheckByIndex,
  setMovesSlideIndex,
  clearMoveSlice,
} = moveSlice.actions

// this is for configureStore
export default moveSlice.reducer
