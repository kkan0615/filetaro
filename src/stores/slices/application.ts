import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ApplicationSetting, DefaultDateFormat, DefaultTimeFormat } from '@renderer/types/models/setting'

const name = 'applications'

export interface ApplicationState {
  setting: ApplicationSetting
}

const initialState: ApplicationState = {
  setting: {
    dateFormat: DefaultDateFormat,
    timeFormat: null,
  },
}

export const applicationSlice = createSlice({
  name,
  initialState,
  reducers: {
    setApplicationSetting: (state, action: PayloadAction<ApplicationSetting>) => {
      state.setting = {
        ...state.setting,
        ...action.payload
      }
    },
  },
})

// this is for dispatch
export const {
  setApplicationSetting,
} = applicationSlice.actions

// this is for configureStore
export default applicationSlice.reducer
