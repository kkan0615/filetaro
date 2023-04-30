import { Outlet } from 'react-router'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { settingStore } from '@renderer/stores/tauriStore'
import { SettingStoreKey } from '@renderer/types/store'
import { OrganizeSetting } from '@renderer/types/models/organize'
import CLoading from '@renderer/components/commons/Loading'
import { clearDeleteSlice, setDeleteSetting } from '@renderer/stores/slices/deletes'
import { Box } from '@chakra-ui/react'

function OrganizeLayout() {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)

  // Load Move Page Setting
  useEffect(() => {
    setIsLoading(true)
    settingStore.get<Partial<OrganizeSetting>>(SettingStoreKey.DeleteSetting)
      .then(value => {
        dispatch(setDeleteSetting({
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
      dispatch(clearDeleteSlice())
    }
  }, [])

  return (
    <Box height="100vh">
      { isLoading ? <CLoading /> : <Outlet /> }
    </Box>
  )
}

export default OrganizeLayout
