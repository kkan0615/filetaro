import Splitter from '@renderer/components/Splitter'
import MovesLeft from '@renderer/components/moves/Left'
import MovesRight from '@renderer/components/moves/Right'

function Moves() {
  return (
    <Splitter left={<MovesLeft />} right={<MovesRight />} />
  )
}

export default Moves
