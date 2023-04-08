import { Outlet } from 'react-router'
import { Suspense, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { settingStore } from '@renderer/stores/tauriStore'
import { SettingStoreKey } from '@renderer/types/store'
import { RenameSetting } from '@renderer/types/models/rename'
import { clearRenameSlice, setRenameSetting } from '@renderer/stores/slices/renames'
import CLoading from '@renderer/components/commons/Loading'

function RenameLayout() {
  const dispatch = useDispatch()

  // Load Move Page Setting
  useEffect(() => {
    const fn = async () => {
      const settingVal = await settingStore.get<Partial<RenameSetting>>(SettingStoreKey.RenameSetting)
      dispatch(setRenameSetting({
        ...settingVal,
      }))
    }
    fn()

    return () => {
      dispatch(setRenameSetting({
        isAutoDuplicatedName: false,
        isKeepOriginal: false,
        isDefaultOpenCard: false,
        isDefaultCheckedOnLoad: false,
      }))
    }
  }, [])

  /**
   * Clear data in store
   */
  useEffect(() => {
    return () => {
      dispatch(clearRenameSlice())
    }
  }, [])

  return (
    <div>
      <Suspense fallback={<CLoading />}>
        <Outlet />
      </Suspense>
    </div>
  )
}

export default RenameLayout
