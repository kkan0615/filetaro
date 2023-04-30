import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { RootState } from '@renderer/stores'
import { useTour } from '@reactour/tour'
import { settingStore } from '@renderer/stores/tauriStore'
import { SettingStoreKey } from '@renderer/types/store'
import { setRenameSetting } from '@renderer/stores/slices/renames'
import { RenameSetting } from '@renderer/types/models/rename'
import Splitter from '@renderer/components/Splitter'
import RenamesLeft from '@renderer/components/renames/Left'
import RenamesRight from '@renderer/components/renames/Right'
import { useTranslation } from 'react-i18next'
import { capitalizeFirstLetter } from '@renderer/utils/text'

function Renames() {
  const { t } = useTranslation()
  const targetFiles = useSelector((state: RootState) => state.renames.targetFiles)
  const setting = useSelector((state: RootState) => state.renames.setting)
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
          selector: '#add-card',
          content: capitalizeFirstLetter(t('pages.renames.tours.addCard')),
        },
        {
          selector: '#replace-card',
          content: capitalizeFirstLetter(t('pages.renames.tours.replaceCard')),
        },
      ])
    }

    // Open tour
    setIsOpen(true)
    setCurrentStep(0)

    // Set it's not first time anymore
    dispatch(setRenameSetting({
      isNotFirstPage: true,
    }))
    settingStore.set(SettingStoreKey.RenameSetting, {
      ...setting,
      isNotFirstPage: true
    } as RenameSetting).then()
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
    dispatch(setRenameSetting({
      isNotFirstLoad: true,
    }))
    settingStore.set(SettingStoreKey.RenameSetting, {
      ...setting,
      isNotFirstLoad: true
    } as RenameSetting).then()
  }, [targetFiles])

  return (
    <Splitter left={<RenamesLeft />} right={<RenamesRight />} />
  )
}

export default Renames
