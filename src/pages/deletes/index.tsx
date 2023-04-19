import {
  Box,
  Card,
  CardBody, Flex,
  IconButton, Spacer,
  Tooltip
} from '@chakra-ui/react'
import { AiOutlineHome, AiOutlineSetting } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import DeletesDirectoryBox from '@renderer/components/deletes/DirectoryBox'
import KeywordPopover from '@renderer/components/popovers/Keyword'
import DeletesSettingModal from '@renderer/components/deletes/SettingDialog'
import DeletesByTypeCard from '@renderer/components/deletes/ByTypeCard'

function Deletes() {
  return (
    <div className="h-full flex-1 flex flex-col">
      <div className="min-h-0 mb-2 shrink p-2">
        <Card position="static" className="p-0">
          <CardBody padding={0} className="p-2 py-1">
            <Flex alignItems="center">
              <Link to="/">
                <Tooltip label="Home">
                  <IconButton
                    variant="ghost"
                    aria-label="home"
                    icon={<AiOutlineHome className="text-2xl" />}
                  />
                </Tooltip>
              </Link>
              <Spacer />
              <KeywordPopover />
              <DeletesSettingModal>
                <Tooltip label="Open setting" placement='auto'>
                  <IconButton
                    variant="ghost"
                    aria-label="Open setting"
                    icon={<AiOutlineSetting className="text-2xl" />}
                  />
                </Tooltip>
              </DeletesSettingModal>
            </Flex>
          </CardBody>
        </Card>
      </div>
      <Box className="grow h-full">
        <Box className="max-w-xl mx-auto py-12">
          <DeletesDirectoryBox />
        </Box>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 justify-items-center p-4 pt-12">
          <DeletesByTypeCard />
        </div>
      </Box>
    </div>
  )
}

export default Deletes
