import { Outlet } from 'react-router'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { clearMoveSlice, setMoveSetting } from '@renderer/stores/slices/moves'
import { settingStore } from '@renderer/stores/tauriStore'
import { MoveSetting } from '@renderer/types/models/move'
import { SettingStoreKey } from '@renderer/types/store'
import CLoading from '@renderer/components/commons/Loading'
import { Box } from '@chakra-ui/react'

function Move() {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)

  // Load Move Page Setting
  useEffect(() => {
    setIsLoading(true)
    settingStore.get<Partial<MoveSetting>>(SettingStoreKey.MoveSetting)
      .then((value) => {
        dispatch(setMoveSetting({
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
      dispatch(clearMoveSlice())
    }
  }, [])

  return (
    <Box height="100vh">
      { isLoading ? <CLoading /> : <Outlet /> }
    </Box>
  )
}

export default Move
