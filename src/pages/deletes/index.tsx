import {
  Box,
  Card,
  CardBody, Collapse, Flex, Heading,
  IconButton, Spacer, Text,
  Tooltip
} from '@chakra-ui/react'
import { AiOutlineHome, AiOutlineSetting } from 'react-icons/ai'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTour } from '@reactour/tour'
import { useTranslation } from 'react-i18next'
import { RootState } from '@renderer/stores'
import { settingStore } from '@renderer/stores/tauriStore'
import { SettingStoreKey } from '@renderer/types/store'
import { DeleteSetting } from '@renderer/types/models/delete'
import { setDeleteSetting } from '@renderer/stores/slices/deletes'
import DeletesDirectoryBox from '@renderer/components/deletes/DirectoryBox'
import KeywordPopover from '@renderer/components/popovers/Keyword'
import DeletesSettingModal from '@renderer/components/deletes/SettingDialog'
import DeletesTypeCard from '@renderer/components/deletes/TypeCard'
import DeletesTextCard from '@renderer/components/deletes/TextCard'
import DeletesExtensionCard from '@renderer/components/deletes/ExtensionCard'
import { capitalizeFirstLetter } from '@renderer/utils/text'

function Deletes() {
  const { t } = useTranslation()
  const setting = useSelector((state: RootState) => state.deletes.setting)
  const { setIsOpen, setSteps, setCurrentStep } = useTour()
  const dispatch = useDispatch()

  const [isFeatureOpen, setIsFeatureOpen] = useState(true)

  /**
   * Start to tour once user enter page.
   */
  useEffect(() => {
    // Only run if it is first time to enter the page
    if (setting.isNotFirstPage) return

    if (setSteps) {
      setSteps([
        {
          selector: '#directory-box',
          content: capitalizeFirstLetter(t('tours.selectTargetDirectory')),
        },
        {
          selector: '#type-card',
          content: capitalizeFirstLetter(t('pages.deletes.tours.typeCard')),
        },
        {
          selector: '#text-card',
          content: capitalizeFirstLetter(t('pages.deletes.tours.textCard')),
        },
        {
          selector: '#extension-card',
          content: capitalizeFirstLetter(t('pages.deletes.tours.extensionCard')),
        },
      ])
    }

    // Open tour
    setIsOpen(true)
    setCurrentStep(0)

    // Set it's not first time anymore
    dispatch(setDeleteSetting({
      isNotFirstPage: true,
    }))
    settingStore.set(SettingStoreKey.DeleteSetting, {
      ...setting,
      isNotFirstPage: true
    } as DeleteSetting).then()
  }, [])

  useEffect(() => {
    setIsFeatureOpen(setting.isDefaultOpenCard)
  }, [setting.isDefaultOpenCard])

  const toggleOpen = () => {
    setIsFeatureOpen((prev) => !prev)
  }

  return (
    <div className="h-full flex-1 flex flex-col">
      <div className="min-h-0 mb-2 shrink p-2">
        <Card position="static" className="p-0">
          <CardBody padding={0} className="p-2 py-1">
            <Flex alignItems="center">
              <Link to="/">
                <Tooltip label={capitalizeFirstLetter(t('tooltips.home'))}>
                  <IconButton
                    variant="ghost"
                    aria-label={capitalizeFirstLetter(t('tooltips.home'))}
                    icon={<AiOutlineHome className="text-2xl" />}
                  />
                </Tooltip>
              </Link>
              <Spacer />
              <KeywordPopover />
              <DeletesSettingModal>
                <Tooltip label={t('tooltips.openSetting')} placement='auto'>
                  <IconButton
                    variant="ghost"
                    aria-label={t('tooltips.openSetting')}
                    icon={<AiOutlineSetting className="text-2xl" />}
                  />
                </Tooltip>
              </DeletesSettingModal>
            </Flex>
          </CardBody>
        </Card>
      </div>
      <Box className="grow h-full">
        <Box className="max-w-xl mx-auto pt-24 pb-12">
          <DeletesDirectoryBox />
        </Box>
        <div className="p-4 pt-12">
          <Flex onClick={toggleOpen} className="cursor-pointer">
            <Heading size="md" mb={4}>{capitalizeFirstLetter(t('pages.deletes.labels.features'))}</Heading>
            <Spacer />
            <Text fontSize="2xl">
              {isFeatureOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
            </Text>
          </Flex>
          <Collapse in={isFeatureOpen} animateOpacity>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 justify-items-center">
              <DeletesTypeCard />
              <DeletesTextCard />
              <DeletesExtensionCard />
            </div>
          </Collapse>
        </div>
      </Box>
    </div>
  )
}

export default Deletes
