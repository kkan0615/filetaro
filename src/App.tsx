import MainRoutes from './router'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
function App() {
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
