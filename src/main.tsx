import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
/* Install i18n-next module */
import './i18n'
import { Provider } from 'react-redux'
import store from './stores'
import './index.scss'
// Chakra UI
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '@renderer/utils/libs/Chakra'
import App from './App'
import { TourProvider } from '@reactour/tour'
import TourCloseBtn from '@renderer/components/buttons/TourClose'

const steps: any[] = []

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <Provider store={store}>
    <ChakraProvider theme={theme}>
      <TourProvider
        className="text-black"
        steps={steps}
        components={{
          Close: TourCloseBtn
        }}
      >
        <HashRouter>
          <App />
        </HashRouter>
      </TourProvider>
    </ChakraProvider>
  </Provider>
  // </React.StrictMode>
)
