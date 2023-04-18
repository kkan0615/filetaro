import Splitter from '@renderer/components/Splitter'
import RenamesLeft from '@renderer/components/renames/Left'
import RenamesRight from '@renderer/components/renames/Right'

function Renames() {
  return (
    <Splitter left={<RenamesLeft />} right={<RenamesRight />} />
  )
}

export default Renames
