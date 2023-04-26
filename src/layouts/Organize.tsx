import { Outlet } from 'react-router'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { settingStore } from '@renderer/stores/tauriStore'
import { SettingStoreKey } from '@renderer/types/store'
import { clearOrganizeSlice, setOrganizeSetting } from '@renderer/stores/slices/organizes'
import { OrganizeSetting } from '@renderer/types/models/organize'
import CLoading from '@renderer/components/commons/Loading'
import { Box } from '@chakra-ui/react'

function OrganizeLayout() {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)

  // Load Move Page Setting
  useEffect(() => {
    setIsLoading(true)
    settingStore.get<Partial<OrganizeSetting>>(SettingStoreKey.OrganizeSetting)
      .then(value => {
        dispatch(setOrganizeSetting({
          ...value,
        }))
        setIsLoading(false)
      })

    return () => {
      setIsLoading(true)
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
    <Box height="100vh">
      { isLoading ? <CLoading /> : <Outlet /> }
    </Box>
  )
}

export default OrganizeLayout
