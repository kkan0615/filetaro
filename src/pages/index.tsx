import { Link } from 'react-router-dom'
import { AiOutlineSetting, BiRename, ImLab, MdDriveFileMoveOutline, VscFileSubmodule } from 'react-icons/all'
import SettingDialog from '@renderer/components/Settings/SettingDialog'
import { Card, CardBody, Heading, IconButton, Text, Tooltip } from '@chakra-ui/react'

function Home() {
  const isDev = import.meta.env.DEV

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="mx-auto max-w-4xl text-center">
        <Heading size="xl">Filetaro</Heading>
        <Text className="mt-2">
          File handler - File handler - Rename, Organize, or Delete files easily
        </Text>
        <div className="flex mb-4">
          <div className="mx-auto" />
          <SettingDialog>
            <Tooltip label='Open setting'>
              <IconButton
                variant="ghost"
                aria-label="home"
                icon={<AiOutlineSetting className="text-2xl" />}
              />
            </Tooltip>
          </SettingDialog>
        </div>
        <div className="grid grid-cols-2 gap-4 justify-items-center">
          <Link className="w-full" to="/moves">
            <Card className="text-base-content card-bg-effect p-4">
              <CardBody className="flex flex-col items-center">
                <MdDriveFileMoveOutline className="text-4xl mb-2" />
                <Heading size='md' className="mb-0.5">Moves</Heading>
                <Text>Move your file to new directory easily!</Text>
              </CardBody>
            </Card>
          </Link>
          <Link className="w-full" to="/renames">
            <Card className="text-base-content card-bg-effect p-4">
              <CardBody className="flex flex-col items-center">
                <BiRename className="text-4xl mb-2" />
                <Heading size='md' className="mb-0.5">Renames</Heading>
                <Text>Add or Change text to file names!</Text>
              </CardBody>
            </Card>
          </Link>
          {isDev &&
            <Link className="w-full" to="/organizes">
              <Card className="text-base-content card-bg-effect p-4">
                <CardBody className="flex flex-col items-center">
                  <VscFileSubmodule className="text-4xl mb-2" />
                  <Heading size='md' className="mb-0.5">Organizes</Heading>
                  <Text>Organize files to directories by your preferences</Text>
                </CardBody>
              </Card>
            </Link>
          }
          {isDev &&
            <Link className="w-full" to="/playgrounds">
              <Card className="text-base-content card-bg-effect p-4">
                <CardBody className="flex flex-col items-center">
                  <ImLab className="text-4xl mb-2" />
                  <Heading size='md' className="mb-0.5">Playgrounds</Heading>
                  <Text>est code in here!</Text>
                </CardBody>
              </Card>
            </Link>
          }
        </div>
      </div>
    </div>
  )
}

export default Home
