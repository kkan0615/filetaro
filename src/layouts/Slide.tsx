import { Outlet } from 'react-router'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Box } from '@chakra-ui/react'
import { settingStore } from '@renderer/stores/tauriStore'
import { SettingStoreKey } from '@renderer/types/store'
import { RenameSetting } from '@renderer/types/models/rename'
import { clearRenameSlice, setRenameSetting } from '@renderer/stores/slices/renames'
import CLoading from '@renderer/components/commons/Loading'

function SlideLayout() {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)

  // Load Move Page Setting
  useEffect(() => {
    // setIsLoading(true)
    // settingStore.get<Partial<RenameSetting>>(SettingStoreKey.RenameSetting)
    //   .then(value => {
    //     dispatch(setRenameSetting({
    //       ...value,
    //     }))
    setIsLoading(false)
    // })

    return () => {
      setIsLoading(true)
    }
  }, [])

  /**
   * Clear data in store
   */
  // useEffect(() => {
  //   return () => {
  //     dispatch(clearRenameSlice())
  //   }
  // }, [])

  return (
    <Box height="100vh">
      { isLoading ? <CLoading /> : <Outlet /> }
    </Box>
  )
}

export default SlideLayout
