import { Outlet } from 'react-router'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { settingStore } from '@renderer/stores/tauriStore'
import { SettingStoreKey } from '@renderer/types/store'
import { ApplicationSetting, DefaultDateFormat, DefaultTimeFormat } from '@renderer/types/models/setting'
import { setApplicationSetting } from '@renderer/stores/slices/application'

function RootLayout() {
  const dispatch = useDispatch()

  // Load Move Page Setting
  useEffect(() => {
    const fn = async () => {
      const settingVal = await settingStore.get<Partial<ApplicationSetting>>(SettingStoreKey.ApplicationSetting)
      dispatch(setApplicationSetting({
        dateFormat: settingVal?.dateFormat || DefaultDateFormat,
        timeFormat: settingVal?.timeFormat || null,
      }))
    }
    fn()

    return () => {
      dispatch(setApplicationSetting({
        dateFormat: DefaultDateFormat,
        timeFormat: DefaultTimeFormat,
      }))
    }
  }, [])

  return <Outlet />
}

export default RootLayout
