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

function Renames() {
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

    // Open tour
    setIsOpen(true)
    setCurrentStep(0)
    if (setSteps) {
      setSteps([
        {
          selector: '#add-files-button',
          content: 'Click it to add files',
        },
        {
          selector: '#add-files-from-directory-button',
          content: 'Or you can load files from directory',
        },
        {
          selector: '#add-card',
          content: 'Add text to file name',
        },
        {
          selector: '#replace-card',
          content: 'Replace specific text to new text',
        },
      ])
    }

    // Set it's not first time anymore
    dispatch(setRenameSetting({
      isNotFirstPage: true,
    }))
    settingStore.set(SettingStoreKey.RenameSetting, {
      ...setting,
      isNotFirstPage: true
    } as RenameSetting).then()

    return () => {
      setIsOpen(false)
    }
  }, [])

  /**
   * Start to tour once user load files.
   */
  useEffect(() => {
    // Only run if it is first time to enter the page
    if (!targetFiles.length || setting.isNotFirstLoad) return

    // Open tour
    setIsOpen(true)
    setCurrentStep(0)
    if (setSteps) {
      setSteps([
        {
          selector: '#selection-checkbox-th',
          content: 'Select the files that you would like to move',
        },
      ])
    }

    // Set it's not first time anymore
    dispatch(setRenameSetting({
      isNotFirstLoad: true,
    }))
    settingStore.set(SettingStoreKey.RenameSetting, {
      ...setting,
      isNotFirstLoad: true
    } as RenameSetting).then()

    return () => {
      setIsOpen(false)
    }
  }, [targetFiles])

  return (
    <Splitter left={<RenamesLeft />} right={<RenamesRight />} />
  )
}

export default Renames
