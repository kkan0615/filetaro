import { Outlet } from 'react-router'
import { Suspense, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { settingStore } from '@renderer/stores/tauriStore'
import { SettingStoreKey } from '@renderer/types/store'
import { OrganizeSetting } from '@renderer/types/models/organize'
import CLoading from '@renderer/components/commons/Loading'
import { clearDeleteSlice, setDeleteSetting } from '@renderer/stores/slices/deletes'
import { Box } from '@chakra-ui/react'

function OrganizeLayout() {
  const dispatch = useDispatch()

  // Load Move Page Setting
  useEffect(() => {
    settingStore.get<Partial<OrganizeSetting>>(SettingStoreKey.DeleteSetting)
      .then(value => {
        dispatch(setDeleteSetting({
          ...value,
        }))
      })
  }, [])

  /**
   * Clear data in store
   */
  useEffect(() => {
    return () => {
      dispatch(clearDeleteSlice())
    }
  }, [])

  return (
    <Box height="100vh">
      <Suspense fallback={<CLoading />}>
        <Outlet />
      </Suspense>
    </Box>
  )
}

export default OrganizeLayout
