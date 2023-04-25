import MainRoutes from './router'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// import { useEffect } from 'react'
// import { settingStore } from '@renderer/stores/tauriStore'
// import { SettingStoreKey } from '@renderer/types/store'
// import { MoveSetting } from '@renderer/types/models/move'
// import { useSelector } from 'react-redux'
// import { RootState } from '@renderer/stores'

function App() {
  // const setting = useSelector((state: RootState) => state.moves.setting)
  //
  // useEffect(() => {
  //   settingStore.set(SettingStoreKey.MoveSetting, {
  //     ...setting,
  //     isFirstPageEnter: false,
  //     isFirstLoad: false,
  //   } as MoveSetting).then()
  // })

  return (
    <div>
      <MainRoutes />
      <ToastContainer
        position="bottom-right"
        theme="colored"
        pauseOnHover
        pauseOnFocusLoss
      />
    </div>
  )
}

export default App
