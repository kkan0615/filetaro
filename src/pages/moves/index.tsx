import Splitter from '@renderer/components/Splitter'
import MovesLeft from '@renderer/components/moves/Left'
import MovesRight from '@renderer/components/moves/Right'

function Moves() {
  return (
    <div className="h-screen w-full">
      <Splitter left={<MovesLeft />} right={<MovesRight />} />
    </div>
  )
}

export default Moves
