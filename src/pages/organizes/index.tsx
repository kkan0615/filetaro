import { useDispatch, useSelector } from 'react-redux'
import { useTour } from '@reactour/tour'
import { useEffect } from 'react'
import { RootState } from '@renderer/stores'
import { settingStore } from '@renderer/stores/tauriStore'
import { SettingStoreKey } from '@renderer/types/store'
import { setOrganizeSetting } from '@renderer/stores/slices/organizes'
import { OrganizeSetting } from '@renderer/types/models/organize'
import Splitter from '@renderer/components/Splitter'
import OrganizeLeft from '@renderer/components/organizes/Left'
import OrganizesRight from '@renderer/components/organizes/Right'
import { useTranslation } from 'react-i18next'
import { capitalizeFirstLetter } from '@renderer/utils/text'

function Organizes() {
  const { t } = useTranslation()

  const targetFiles = useSelector((state: RootState) => state.organizes.targetFiles)
  const setting = useSelector((state: RootState) => state.organizes.setting)
  const { setIsOpen, setSteps, setCurrentStep } = useTour()
  const dispatch = useDispatch()

  /**
   * Start to tour once user enter page.
   */
  useEffect(() => {
    // Only run if it is first time to enter the page
    if (setting.isNotFirstPage) return

    if (setSteps) {
      setSteps([
        {
          selector: '#add-files-button',
          content: t('tours.addFilesButton').toString(),
        },
        {
          selector: '#add-files-from-directory-button',
          content: t('tours.addFilesFromDirectoryButton').toString(),
        },
        {
          selector: '#directory-path-card',
          content: t('pages.organizes.tours.directoryPathCard').toString(),
        },
        {
          selector: '#type-card',
          content: t('pages.organizes.tours.typeCard').toString(),
        },
        {
          selector: '#extension-card',
          content: t('pages.organizes.tours.extensionCard').toString(),
        },
        {
          selector: '#text-card',
          content: t('pages.organizes.tours.textCard').toString(),
        },
      ])
    }

    // Open tour
    setIsOpen(true)
    setCurrentStep(0)

    // Set it's not first time anymore
    dispatch(setOrganizeSetting({
      isNotFirstPage: true,
    }))
    settingStore.set(SettingStoreKey.OrganizeSetting, {
      ...setting,
      isNotFirstPage: true
    } as OrganizeSetting).then()
  }, [])

  /**
   * Start to tour once user load files.
   */
  useEffect(() => {
    // Only run if it is first time to enter the page
    if (!targetFiles.length || setting.isNotFirstLoad) return

    if (setSteps) {
      setSteps([
        {
          selector: '#selection-checkbox-th',
          content: capitalizeFirstLetter(t('tours.selectionCheckboxTh')),
        },
      ])
    }

    // Open tour
    setIsOpen(true)
    setCurrentStep(0)

    // Set it's not first time anymore
    dispatch(setOrganizeSetting({
      isNotFirstLoad: true,
    }))
    settingStore.set(SettingStoreKey.OrganizeSetting, {
      ...setting,
      isNotFirstLoad: true
    } as OrganizeSetting).then()
  }, [targetFiles])

  return (
    <Splitter left={<OrganizeLeft />} right={<OrganizesRight />} />
  )
}

export default Organizes
