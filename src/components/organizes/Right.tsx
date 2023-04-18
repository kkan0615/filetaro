import { Box, Card, CardBody, Flex, Heading, IconButton, List, Spacer, Tooltip } from '@chakra-ui/react'
import { AiOutlineSetting } from 'react-icons/ai'
import KeywordPopover from '@renderer/components/popovers/Keyword'
import OrganizesSettingModal from '@renderer/components/organizes/SettingDialog'
import DirectoryPathCard from '@renderer/components/organizes/DirectoryPathCard'
import OrganizesByTypeCard from '@renderer/components/organizes/ByTypeCard'
import OrganizesByExtCard from '@renderer/components/organizes/ByExtCard'
import OrganizesByTextCard from '@renderer/components/organizes/ByTextCard'

function OrganizesRight() {
  return (
    <div className="h-full flex-1 flex flex-col">
      <div className="min-h-0 mb-2 shrink p-2">
        <Card position="static" className="p-0">
          <CardBody padding={0} className="p-2 py-1">
            <Flex alignItems="center">
              <Heading size="md">Functions</Heading>
              <Spacer />
              <KeywordPopover />
              <OrganizesSettingModal>
                <Tooltip label="Open setting" placement='auto'>
                  <IconButton
                    variant="ghost"
                    aria-label="Open setting"
                    icon={<AiOutlineSetting className="text-2xl" />}
                  />
                </Tooltip>
              </OrganizesSettingModal>
            </Flex>
          </CardBody>
        </Card>
      </div>
      <Box className="grow h-1 overflow-y-auto px-4 py-2">
        <List spacing={4}>
          <DirectoryPathCard />
          <OrganizesByTypeCard />
          <OrganizesByExtCard />
          <OrganizesByTextCard type="included"/>
          <OrganizesByTextCard type="prefix"/>
          <OrganizesByTextCard type="suffix"/>
        </List>
      </Box>
    </div>
  )
}

export default OrganizesRight
