import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TargetFile, UpdateTargetFiles } from '@renderer/types/models/targetFile'
import { SlideSetting } from '@renderer/types/models/slide'

const name = 'slides'

export interface SlideState {
  setting: SlideSetting
  targetFiles: TargetFile[]
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
    updateSlideTargetFileCheckByIndex(
      state,
      action: PayloadAction<{ index: number; isCheck: boolean }>
    ) {
      const newTargetFiles = [...state.targetFiles]
      newTargetFiles[action.payload.index].checked = action.payload.isCheck
      state.targetFiles = newTargetFiles
    },
    removeSlideTargetFileByPath: (state, action: PayloadAction<string>) => {
      state.targetFiles = state.targetFiles.filter(
        (targetFileEl) => targetFileEl.path !== action.payload
      )
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
    }
  },
})

// this is for dispatch
export const {
  setSlideSetting,
  addSlideTargetFile,
  updateSlideTargetFile,
  updateSlideTargetFileCheckByIndex,
  removeSlideTargetFileByPath,
  clearSlideSlice,
} = slideSlice.actions

// this is for configureStore
export default slideSlice.reducer
