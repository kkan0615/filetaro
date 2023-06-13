import { FaSpinner } from 'react-icons/fa'

function CLoading() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="flex flex-col justify-center items-center gap-y-4">
        <FaSpinner className="text-2xl animate-spin" />
        <p className="text-xl">Loading ...</p>
      </div>
    </div>
  )
}

export default CLoading
