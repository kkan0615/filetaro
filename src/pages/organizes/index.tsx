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

function Organizes() {
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
          selector: '#directory-path-card',
          content: 'Select or type output path. Folders will be here',
        },
        {
          selector: '#type-card',
          content: 'Organize files by file type',
        },
        {
          selector: '#extension-card',
          content: 'Organize files by file extension',
        },
        {
          selector: '#text-card',
          content: 'Organize files by text',
        },
      ])
    }

    // Set it's not first time anymore
    dispatch(setOrganizeSetting({
      isNotFirstPage: true,
    }))
    settingStore.set(SettingStoreKey.OrganizeSetting, {
      ...setting,
      isNotFirstPage: true
    } as OrganizeSetting).then()

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
          content: 'Select the files that you would like to organize',
        },
      ])
    }

    // Set it's not first time anymore
    dispatch(setOrganizeSetting({
      isNotFirstLoad: true,
    }))
    settingStore.set(SettingStoreKey.OrganizeSetting, {
      ...setting,
      isNotFirstLoad: true
    } as OrganizeSetting).then()

    return () => {
      setIsOpen(false)
    }
  }, [targetFiles])

  return (
    <Splitter left={<OrganizeLeft />} right={<OrganizesRight />} />
  )
}

export default Organizes
