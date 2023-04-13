import { Outlet } from 'react-router'
import { Suspense, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { settingStore } from '@renderer/stores/tauriStore'
import { SettingStoreKey } from '@renderer/types/store'
import { clearOrganizeSlice, setOrganizeSetting } from '@renderer/stores/slices/organizes'
import { OrganizeSetting } from '@renderer/types/models/organize'
import CLoading from '@renderer/components/commons/Loading'

function OrganizeLayout() {
  const dispatch = useDispatch()

  // Load Move Page Setting
  useEffect(() => {
    const fn = async () => {
      const settingVal = await settingStore.get<Partial<OrganizeSetting>>(SettingStoreKey.OrganizeSetting)
      dispatch(setOrganizeSetting({
        ...settingVal,
      }))
    }
    fn()

    return () => {
      dispatch(setOrganizeSetting({
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
      dispatch(clearOrganizeSlice())
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

export default OrganizeLayout
