import Splitter from '@renderer/components/Splitter'
import OrganizeLeft from '@renderer/components/organizes/Left'
import OrganizesRight from '@renderer/components/organizes/Right'

function Organizes() {
  return (
    <Splitter left={<OrganizeLeft />} right={<OrganizesRight />} />
  )
}

export default Organizes
