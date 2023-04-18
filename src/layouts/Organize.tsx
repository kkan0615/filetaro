import { Outlet } from 'react-router'
import { Suspense, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { settingStore } from '@renderer/stores/tauriStore'
import { SettingStoreKey } from '@renderer/types/store'
import { clearOrganizeSlice, setOrganizeSetting } from '@renderer/stores/slices/organizes'
import { OrganizeSetting } from '@renderer/types/models/organize'
import CLoading from '@renderer/components/commons/Loading'
import { Box } from '@chakra-ui/react'

function OrganizeLayout() {
  const dispatch = useDispatch()

  // Load Move Page Setting
  useEffect(() => {
    settingStore.get<Partial<OrganizeSetting>>(SettingStoreKey.OrganizeSetting)
      .then(value => {
        dispatch(setOrganizeSetting({
          ...value,
        }))
      })
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
    <Box height="100vh">
      <Suspense fallback={<CLoading />}>
        <Outlet />
      </Suspense>
    </Box>
  )
}

export default OrganizeLayout
