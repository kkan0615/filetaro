import Index from '@renderer/components/Splitter'
import RenamesLeft from '@renderer/components/renames/Left'
import RenamesRight from '@renderer/components/renames/Right'

function Renames() {
  return (
    <div className="h-screen w-full">
      <Index left={<RenamesLeft />} right={<RenamesRight />} />
    </div>
  )
}

export default Renames
