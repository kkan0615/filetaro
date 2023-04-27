import { useDispatch, useSelector } from 'react-redux'
import { useTour } from '@reactour/tour'
import { useEffect } from 'react'
import { RootState } from '@renderer/stores'
import { setMoveSetting } from '@renderer/stores/slices/moves'
import { settingStore } from '@renderer/stores/tauriStore'
import { SettingStoreKey } from '@renderer/types/store'
import { MoveSetting } from '@renderer/types/models/move'
import Splitter from '@renderer/components/Splitter'
import MovesLeft from '@renderer/components/moves/Left'
import MovesRight from '@renderer/components/moves/Right'
import { useTranslation } from 'react-i18next'

function Moves() {
  const { t } = useTranslation()
  const targetFiles = useSelector((state: RootState) => state.moves.targetFiles)
  const setting = useSelector((state: RootState) => state.moves.setting)
  const { setIsOpen, setSteps, setCurrentStep, isOpen } = useTour()
  const dispatch = useDispatch()

  /**
   * Start to tour once user enter page.
   */
  useEffect(() => {
    console.log(setting)
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
          selector: '#add-directory-button',
          content: t('pages.moves.tours.addDirectoryButton').toString(),
        },
      ])
    }

    // Open tour
    setIsOpen(true)
    setCurrentStep(0)

    // Set it's not first time anymore
    dispatch(setMoveSetting({
      isNotFirstPage: true,
    }))
    settingStore.set(SettingStoreKey.MoveSetting, {
      ...setting,
      isNotFirstPage: true
    } as MoveSetting).then()
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
          selector: '#start-slide-show-button',
          content: t('pages.moves.tours.startSlideShowButton').toString(),
        },
        {
          selector: '#selection-checkbox-th',
          content: t('tours.selectionCheckboxTh').toString(),
        },
      ])
    }

    // Open tour
    setIsOpen(true)
    setCurrentStep(0)

    // Set it's not first time anymore
    dispatch(setMoveSetting({
      isNotFirstLoad: true,
    }))
    settingStore.set(SettingStoreKey.MoveSetting, {
      ...setting,
      isNotFirstLoad: true
    } as MoveSetting).then()
  }, [targetFiles])

  return (
    <Splitter left={<MovesLeft />} right={<MovesRight />} />
  )
}

export default Moves
