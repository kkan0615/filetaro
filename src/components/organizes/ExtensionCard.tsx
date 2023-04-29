import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader, Collapse, Flex,
  Heading,
  Spacer,
  Text
} from '@chakra-ui/react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { RootState } from '@renderer/stores'
import { TargetFile } from '@renderer/types/models/targetFile'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/all'
import { moveOrCopyFile, overrideOrCreateDirectory } from '@renderer/utils/file'
import { removeOrganizeTargetFileByPath } from '@renderer/stores/slices/organizes'
import { useTranslation } from 'react-i18next'
import { capitalizeFirstLetter } from '@renderer/utils/text'

function OrganizesExtensionCard() {
  const { t } = useTranslation()

  const checkedTargetFiles = useSelector((state: RootState) => state.organizes.targetFiles.filter(targetFileEl => targetFileEl.checked))
  const directoryPath = useSelector((state: RootState) => state.organizes.directoryPath)
  const setting = useSelector((state: RootState) => state.organizes.setting)
  const dispatch = useDispatch()

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const toggleOpen = () => {
    setIsOpen((prev) => !prev)
  }

  const handleClick = async () => {
    try {
      if (!checkedTargetFiles.length) {
        toast(capitalizeFirstLetter(t('texts.alerts.noSelectedFileWarning')), {
          type: 'warning'
        })
        return
      }

      if (!directoryPath) {
        toast(capitalizeFirstLetter(t('texts.alerts.noOutputWarning')), {
          type: 'warning'
        })
        return
      }
      setIsLoading(true)

      // File type map
      const fileExtMap: Record<string, TargetFile[]> = {}
      checkedTargetFiles.map(checkedTargetFileEl => {
        if (!fileExtMap[checkedTargetFileEl.ext]) fileExtMap[checkedTargetFileEl.ext] = []
        fileExtMap[checkedTargetFileEl.ext].push(checkedTargetFileEl)
      })

      // Loop file types
      await Promise.all(Object.keys(fileExtMap).map(async (keyEl) => {
        // new directory path
        let fullDirectoryPath = directoryPath + '\\' + keyEl
        // Create directory
        fullDirectoryPath = await overrideOrCreateDirectory({
          directoryPath: fullDirectoryPath,
          isOverride: setting.isOverrideDirectory,
          isAutoDuplicatedName: setting.isAutoDuplicatedName,
        })
        // Move or Copy files
        await Promise.all(fileExtMap[keyEl].map(async (fileEl) => {
          await moveOrCopyFile({
            file: fileEl,
            directoryPath: fullDirectoryPath,
            isAutoDuplicatedName: setting.isAutoDuplicatedName,
            isCopy: setting.isKeepOriginal,
          })
          // Remove from slice
          dispatch(removeOrganizeTargetFileByPath(fileEl.path))
        }))
      }))

      toast(capitalizeFirstLetter(t('pages.organizes.texts.alerts.organizeSuccess')), {
        type: 'success'
      })
    } catch (e) {
      console.error(e)
      toast(capitalizeFirstLetter(t('pages.organizes.texts.alerts.organizeError')), {
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card id="extension-card">
      <CardHeader onClick={toggleOpen} className="p-3 cursor-pointer">
        <Flex alignItems="center">
          <Heading size="md">{capitalizeFirstLetter(t('labels.extension'))}</Heading>
          <Spacer />
          <Text fontSize="2xl">
            {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </Text>
        </Flex>
      </CardHeader>
      <Collapse in={isOpen} animateOpacity>
        <CardBody className="p-3">
          <Text>{capitalizeFirstLetter(t('pages.organizes.labels.extensionSubtitle'))}</Text>
        </CardBody>
        <CardFooter className="p-3">
          <Button
            width='100%'
            color="white"
            onClick={handleClick}
            colorScheme="primary"
            isLoading={isLoading}
            loadingText={capitalizeFirstLetter(t('labels.organizing'))}
          >
            {capitalizeFirstLetter(t('buttons.organize'))}
          </Button>
        </CardFooter>
      </Collapse>
    </Card>
  )
}

export default OrganizesExtensionCard
