import { Outlet } from 'react-router'
import { Suspense, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { clearMoveSlice, setMoveSetting } from '@renderer/stores/slices/moves'
import { settingStore } from '@renderer/stores/tauriStore'
import { MoveSetting } from '@renderer/types/models/move'
import { SettingStoreKey } from '@renderer/types/store'
import CLoading from '@renderer/components/commons/Loading'
import { Box } from '@chakra-ui/react'

function Move() {
  const dispatch = useDispatch()

  // Load Move Page Setting
  useEffect(() => {
    const fn = async () => {
      const settingVal = await settingStore.get<Partial<MoveSetting>>(SettingStoreKey.MoveSetting)
      dispatch(setMoveSetting({
        ...settingVal,
      }))
    }
    fn()

    return () => {
      dispatch(setMoveSetting({
        isAutoDuplicatedName: false,
        isKeepOriginal: false,
        isDefaultCheckedOnLoad: false,
      }))
    }
  }, [])

  /**
   * Clear data in store
   */
  useEffect(() => {
    return () => {
      dispatch(clearMoveSlice())
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

export default Move
