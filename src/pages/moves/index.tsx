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

function Moves() {
  const targetFiles = useSelector((state: RootState) => state.moves.targetFiles)
  const setting = useSelector((state: RootState) => state.moves.setting)
  const { setIsOpen, setSteps, setCurrentStep } = useTour()
  const dispatch = useDispatch()

  /**
   * Start to tour once user enter page.
   */
  useEffect(() => {
    // Only run if it is first time to enter the page
    if (setting.isFirstPageEnter) return

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
          selector: '#add-directory-button',
          content: 'Add Directories to move',
        },
      ])
    }

    // Set it's not first time anymore
    dispatch(setMoveSetting({
      isFirstPageEnter: true,
    }))
    settingStore.set(SettingStoreKey.MoveSetting, {
      ...setting,
      isFirstPageEnter: true
    } as MoveSetting).then()

    return () => {
      setIsOpen(false)
    }
  }, [])

  /**
   * Start to tour once user load files.
   */
  useEffect(() => {
    // Only run if it is first time to enter the page
    if (!targetFiles.length || setting.isFirstLoad) return

    // Open tour
    setIsOpen(true)
    setCurrentStep(0)
    if (setSteps) {
      setSteps([
        {
          selector: '#start-slide-show-button',
          content: 'Start slide show from first',
        },
        {
          selector: '#selection-checkbox-th',
          content: 'Select the files that you would like to move',
        },
      ])
    }

    // Set it's not first time anymore
    dispatch(setMoveSetting({
      isFirstLoad: true,
    }))
    settingStore.set(SettingStoreKey.MoveSetting, {
      ...setting,
      isFirstLoad: true
    } as MoveSetting).then()

    return () => {
      setIsOpen(false)
    }
  }, [targetFiles])

  return (
    <Splitter left={<MovesLeft />} right={<MovesRight />} />
  )
}

export default Moves
