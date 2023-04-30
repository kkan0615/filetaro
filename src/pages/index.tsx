import { Link } from 'react-router-dom'
import { AiOutlineSetting, BiRename, ImLab, MdDriveFileMoveOutline, VscFileSubmodule } from 'react-icons/all'
import SettingDialog from '@renderer/components/Settings/SettingDialog'
import { Card, CardBody, Heading, IconButton, Text, Tooltip } from '@chakra-ui/react'
import { AiOutlineDelete } from 'react-icons/ai'
import { useTranslation } from 'react-i18next'

function Home() {
  const { t } = useTranslation()
  const isDev = import.meta.env.DEV

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="mx-auto max-w-4xl text-center">
        <Heading size="xl">{t('SEO.title')}</Heading>
        <Text className="mt-2">
          {t('SEO.description')}
        </Text>
        <div className="flex mb-4">
          <div className="mx-auto" />
          <SettingDialog>
            <Tooltip label={t('tooltips.openSetting')}>
              <IconButton
                variant="ghost"
                aria-label={t('buttons.setting')}
                icon={<AiOutlineSetting className="text-2xl" />}
              />
            </Tooltip>
          </SettingDialog>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
          <Link className="w-full" to="/moves">
            <Card className="text-base-content card-bg-effect p-4">
              <CardBody className="flex flex-col items-center">
                <MdDriveFileMoveOutline className="text-4xl mb-2" />
                <Heading size='md' className="mb-0.5 capitalize">{t('pages.home.moves.title')}</Heading>
                <Text>{t('pages.home.moves.description')}</Text>
              </CardBody>
            </Card>
          </Link>
          <Link className="w-full" to="/renames">
            <Card className="text-base-content card-bg-effect p-4">
              <CardBody className="flex flex-col items-center">
                <BiRename className="text-4xl mb-2" />
                <Heading size='md' className="mb-0.5 capitalize">{t('pages.home.renames.title')}</Heading>
                <Text>{t('pages.home.renames.description')}</Text>
              </CardBody>
            </Card>
          </Link>
          <Link className="w-full" to="/organizes">
            <Card className="text-base-content card-bg-effect p-4">
              <CardBody className="flex flex-col items-center">
                <VscFileSubmodule className="text-4xl mb-2" />
                <Heading size='md' className="mb-0.5 capitalize">{t('pages.home.organizes.title')}</Heading>
                <Text>{t('pages.home.organizes.description')}</Text>
              </CardBody>
            </Card>
          </Link>
          {isDev &&
            <Link className="w-full" to="/deletes">
              <Card className="text-base-content card-bg-effect p-4">
                <CardBody className="flex flex-col items-center">
                  <AiOutlineDelete className="text-4xl mb-2" />
                  <Heading size='md' className="mb-0.5 capitalize">{t('pages.home.deletes.title')}</Heading>
                  <Text>{t('pages.home.deletes.description')}</Text>
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
                  <Text>test code in here!</Text>
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
