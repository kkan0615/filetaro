import { Box, Card, CardBody, CardHeader, Flex, Heading, IconButton, List, Spacer, Tooltip } from '@chakra-ui/react'
import KeywordPopover from '@renderer/components/popovers/Keyword'
import RenamesSettingModal from '@renderer/components/renames/SettingDialog'
import { AiOutlineSetting } from 'react-icons/ai'
import ByTypeCard from '@renderer/components/organizes/ByTypeCard'

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
              <RenamesSettingModal>
                <Tooltip label="Open setting" placement='auto'>
                  <IconButton
                    variant="ghost"
                    aria-label="Open setting"
                    icon={<AiOutlineSetting className="text-2xl" />}
                  />
                </Tooltip>
              </RenamesSettingModal>
            </Flex>
          </CardBody>
        </Card>
      </div>
      <Box className="grow h-1 overflow-y-auto px-4 py-2">
        <List spacing={4}>
          <ByTypeCard />
          <Card>
            <CardHeader className="py-3">
              <Heading size='md'>By Name</Heading>
            </CardHeader>
            <CardBody className="pb-3 pt-0">
              <p>Organize by type</p>
            </CardBody>
          </Card>
        </List>
      </Box>
    </div>
  )
}

export default OrganizesRight
