// import { OpenDialogOptions, OpenDialogReturnValue } from 'electron'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { AiOutlineHome } from 'react-icons/ai'
import { settingStore } from '@renderer/stores/tauriStore'

function Playgrounds() {
  const handleTest = async () => {
    const val = await settingStore.set('some-key', { a: 1, b: 2 })
  }

  const handleTest2 = async () => {
    const val = await settingStore.get<{a: number, b: number}>('some-key')
  }

  return (
    <div>
      <h1 className="text-2xl">It is Playground</h1>
      <Link to="/">
        <div className="tooltip tooltip-bottom z-20 mr-2" data-tip="Home">
          <button className="btn btn-sm">
            <AiOutlineHome className="text-2xl mr-1.5" />
            <div>
              Home
            </div>
          </button>
        </div>
      </Link>
      <div className="mt-4">
        <div className="flex space-x-2">
          <button className="btn btn-primary" onClick={handleTest} type="button">
            Test
          </button>
          <button className="btn btn-primary" onClick={handleTest2} type="button">
            Test2
          </button>
        </div>
      </div>
    </div>
  )
}

export default Playgrounds
