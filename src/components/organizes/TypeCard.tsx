import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader, Collapse, Flex,
  Heading,
  Spacer,
  Text, useBoolean
} from '@chakra-ui/react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { RootState } from '@renderer/stores'
import { TargetFile } from '@renderer/types/models/targetFile'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'
import { moveOrCopyFile, overrideOrCreateDirectory } from '@renderer/utils/file'
import { removeOrganizeTargetFileByPath } from '@renderer/stores/slices/organizes'
import { useTranslation } from 'react-i18next'
import { capitalizeFirstLetter } from '@renderer/utils/text'
import { exists } from '@tauri-apps/api/fs'

function OrganizesTypeCard() {
  const { t } = useTranslation()

  const checkedTargetFiles = useSelector((state: RootState) => state.organizes.targetFiles.filter(targetFileEl => targetFileEl.checked))
  const directoryPath = useSelector((state: RootState) => state.organizes.directoryPath)
  const setting = useSelector((state: RootState) => state.organizes.setting)
  const dispatch = useDispatch()

  const [isOpen, setIsOpen] = useBoolean()
  const [isLoading, setIsLoading] = useState(false)

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
      // Check directory is existed
      if (!await exists(directoryPath)) {
        toast(capitalizeFirstLetter(t('texts.alerts.noExDirectoryError')), {
          type: 'error'
        })
        return
      }
      setIsLoading(true)

      // File type map
      const fileTypeMap: Record<string, TargetFile[]> = {}
      checkedTargetFiles.map(checkedTargetFileEl => {
        if (!fileTypeMap[checkedTargetFileEl.type]) fileTypeMap[checkedTargetFileEl.type] = []
        fileTypeMap[checkedTargetFileEl.type].push(checkedTargetFileEl)
      })

      // Loop file types
      await Promise.all(Object.keys(fileTypeMap).map(async (keyEl) => {
        // new directory path
        let fullDirectoryPath = directoryPath + '\\' + keyEl
        fullDirectoryPath = await overrideOrCreateDirectory({
          directoryPath: fullDirectoryPath,
          isOverride: setting.isOverrideDirectory,
          isAutoDuplicatedName: setting.isAutoDuplicatedName,
        })
        if (fullDirectoryPath) {
          // Move or Copy files
          await Promise.all(fileTypeMap[keyEl].map(async (fileEl) => {
            const isDone = await moveOrCopyFile({
              file: fileEl,
              directoryPath: fullDirectoryPath,
              isAutoDuplicatedName: setting.isAutoDuplicatedName,
              isCopy: setting.isKeepOriginal
            })
            if (isDone) {
              // Remove from slice
              dispatch(removeOrganizeTargetFileByPath(fileEl.path))
            }
          }))
        }
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
    <Card id="type-card">
      <CardHeader onClick={setIsOpen.toggle} className="p-3 cursor-pointer">
        <Flex alignItems="center">
          <Heading size="md">{capitalizeFirstLetter(t('labels.type'))}</Heading>
          <Spacer />
          <Text fontSize="2xl">
            {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </Text>
        </Flex>
      </CardHeader>
      <Collapse in={isOpen} animateOpacity>
        <CardBody className="p-3">
          <Text>{capitalizeFirstLetter(t('pages.organizes.labels.typeSubtitle'))}</Text>
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

export default OrganizesTypeCard
