import Splitter from '@renderer/components/Splitter'
import OrganizeLeft from '@renderer/components/organizes/Left'
import OrganizesRight from '@renderer/components/organizes/Right'

function Organizes() {
  return (
    <div className="h-screen w-full">
      <Splitter left={<OrganizeLeft />} right={<OrganizesRight />} />
    </div>
  )
}

export default Organizes
