import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { TargetFile, UpdateTargetFiles } from '@renderer/types/models/targetFile'
import { NO_SLIDE_INDEX, SlideSetting } from '@renderer/types/models/slide'
import { MoveDirectory } from '@renderer/types/models/move'
import { MoveSortType } from '@renderer/types/models/directory'

const name = 'slides'

export interface SlideState {
  setting: SlideSetting,
  targetFiles: TargetFile[],
  slideIndex: number
  directories: MoveDirectory[]

}

const initialState: SlideState = {
  setting: {
    isAutoDuplicatedName: false,
    isKeepOriginal: false,
    isDefaultCheckedOnLoad: false,
    isNotFirstPage: false,
    isNotFirstLoad: false,
    isAutoPlay: false,
  },
  targetFiles: [],
  slideIndex: NO_SLIDE_INDEX,
  directories: []
}

export const slideSlice = createSlice({
  name,
  initialState,
  reducers: {
    setSlideSetting: (state, action: PayloadAction<Partial<SlideSetting>>) => {
      state.setting = {
        ...state.setting,
        ...action.payload
      }
    },
    // setMoveIsBlockKey: (state, action: PayloadAction<boolean>) => {
    //   state.isBlockKey = action.payload
    // },
    addSlideDirectory: (state, action: PayloadAction<MoveDirectory>) => {
      state.directories = [...state.directories, action.payload]
    },
    updateMoveDirectoryByPath: (state, action: PayloadAction<MoveDirectory>) => {
      state.directories = state.directories.map(moveDirectoryEl => {
        if (moveDirectoryEl.path === action.payload.path) {
          return action.payload
        }

        return moveDirectoryEl
      })
    },
    removeSlideDirectory: (state, action: PayloadAction<MoveDirectory>) => {
      state.directories = state.directories.filter(
        (directoryEl) => directoryEl.path !== action.payload.path
      )
    },
    sortSlideDirectories: (state, action: PayloadAction<MoveSortType>) => {
      const option = action.payload.slice(1)
      const sort = action.payload.charAt(0) as '+' | '-'
      if (!sort || !option) return

      if (option === 'createdAt') {
        state.directories.sort((a, b) => {
          const dayjsA = dayjs(a.createdAt)
          const dayjsB = dayjs(b.createdAt)
          if (sort === '+') return (dayjsA.isSameOrAfter(dayjsB) ? 1 : -1)

          return (dayjsA.isSameOrAfter(dayjsB) ? -1 : 1)
        })
      } else if (option === 'name') {
        state.directories.sort((a, b) => {
          const aName = a.path.split('\\').at(-1)
          const bName = b.path.split('\\').at(-1)
          if (!aName || !bName) return 0
          if (sort === '+') return aName.localeCompare(bName)

          return bName.localeCompare(aName)
        })
      } else if (option === 'path') {
        state.directories.sort((a, b) => {
          if (sort === '+') return a.path.localeCompare(b.path)

          return b.path.localeCompare(a.path)
        })
      }
    },
    addSlideTargetFile: (state, action: PayloadAction<TargetFile>) => {
      if (state.targetFiles.findIndex((targetFileEl) => targetFileEl.path === action.payload.path) !== -1) return
      state.targetFiles = [...state.targetFiles, action.payload]
    },
    updateSlideTargetFile: (state, action: PayloadAction<{path: string, newData: UpdateTargetFiles }>) => {
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
    removeSlideTargetFileByPath: (state, action: PayloadAction<string>) => {
      state.targetFiles = state.targetFiles.filter(
        (targetFileEl) => targetFileEl.path !== action.payload
      )
    },
    setSlidesIndex: (state, action: PayloadAction<number>) => {
      state.slideIndex = action.payload
    },
    clearSlideSlice: (state) => {
      state.setting = {
        isAutoDuplicatedName: false,
        isKeepOriginal: false,
        isDefaultCheckedOnLoad: false,
        isNotFirstPage: false,
        isNotFirstLoad: false,
        isAutoPlay: false,
      }
      state.targetFiles = []
      state.slideIndex = NO_SLIDE_INDEX
    }
  },
})

// this is for dispatch
export const {
  setSlideSetting,
  addSlideDirectory,
  sortSlideDirectories,
  removeSlideDirectory,
  updateMoveDirectoryByPath,
  addSlideTargetFile,
  updateSlideTargetFile,
  removeSlideTargetFileByPath,
  setSlidesIndex,
  clearSlideSlice,
} = slideSlice.actions

// this is for configureStore
export default slideSlice.reducer
