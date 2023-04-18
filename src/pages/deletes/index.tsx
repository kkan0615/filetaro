import {
  Box,
  Card,
  CardBody, Checkbox, Flex,
  FormControl,
  FormLabel, Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement, List, Spacer,
  Tooltip
} from '@chakra-ui/react'
import { AiOutlineFolderOpen, AiOutlineHome, AiOutlineSetting } from 'react-icons/ai'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { open } from '@tauri-apps/api/dialog'
import { setOrganizeDirectoryPath } from '@renderer/stores/slices/organizes'
import { setDeleteDirectoryPath } from '@renderer/stores/slices/deletes'
import KeywordPopover from '@renderer/components/popovers/Keyword'
import OrganizesSettingModal from '@renderer/components/organizes/SettingDialog'
import { Link } from 'react-router-dom'

function Deletes() {
  const dispatch = useDispatch()
  const [directoryPath, setDirectoryPath] = useState('')

  const selectDirectory = async () => {
    const directoryPath = await open({
      title: 'Select Directory',
      directory: true,
    })

    setDirectoryPath((directoryPath as string) || '')

  }
  useEffect(() => {
    dispatch(setDeleteDirectoryPath(directoryPath))
  }, [directoryPath])

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
      <Box className="grow h-full">
        <Box className="h-full flex items-center justify-center">
          <Box className="w-full max-w-xl">
            {/*<Card className="w-full">*/}
            {/*  <CardBody className="p-3">*/}
            <List spacing={4}>
              <FormControl>
                <FormLabel>Select or type directory path</FormLabel>
                <InputGroup>
                  <Input
                    placeholder="Type here"
                    value={directoryPath}
                    onChange={(e) => setDirectoryPath(e.target.value)}
                  />
                  <InputRightElement>
                    <Tooltip placement="auto" label="select directory">
                      <IconButton
                        variant="ghost"
                        onClick={selectDirectory}
                        aria-label="select directory"
                        icon={<AiOutlineFolderOpen className="text-2xl" />}
                      >
                      </IconButton>
                    </Tooltip>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Checkbox
                size="lg"
                iconColor="white"
                colorScheme="primary"
              >
                <Tooltip label="Check all files in directories in directories" placement='auto'>
                  <span>Recursive</span>
                </Tooltip>
              </Checkbox>
            </List>
            {/*</CardBody>*/}
            {/*</Card>*/}
          </Box>
        </Box>
      </Box>
    </div>
  )
}

export default Deletes
