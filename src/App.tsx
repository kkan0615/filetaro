import MainRoutes from './router'
// import { useTranslation } from 'react-i18next'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// import { Helmet } from 'react-helmet'
// import { useEffect, useState } from 'react'
// import { UnlistenFn } from '@tauri-apps/api/event'
// import { appWindow } from '@tauri-apps/api/window'
function App() {
  // const [currTheme, setCurrTheme] = useState<'navyDark' | 'navyLight' | ''>('')
  // const { t } = useTranslation()
  // useEffect(() => {
  //   appWindow.theme()
  //     .then(theme => {
  //       if (!theme) {
  //         setCurrTheme('navyDark')
  //         return
  //       }
  //
  //       if (theme === 'dark') {
  //         setCurrTheme('navyDark')
  //         return
  //       }
  //
  //       setCurrTheme('navyLight')
  //     })
  // }, [])
  //
  // useEffect(() =>{
  //   const unlisten = appWindow.onThemeChanged(({ payload: theme }) => {
  //     if (theme === 'dark') {
  //       setCurrTheme('navyDark')
  //     } else {
  //       setCurrTheme('navyLight')
  //     }
  //   }).catch(e => {
  //     console.error(e)
  //     toast('Error to add files', {
  //       type: 'error'
  //     })
  //   })
  //
  //   return () => {
  //     const run = async () => {
  //       if (unlisten) {
  //         const unlistenValue = await unlisten as UnlistenFn
  //         unlistenValue()
  //       }
  //     }
  //
  //     run()
  //   }
  // }, [])

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
