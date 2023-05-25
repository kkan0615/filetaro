import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { RootState } from '@renderer/stores'
import { useTour } from '@reactour/tour'
import Splitter from '@renderer/components/Splitter'
import RenamesLeft from '@renderer/components/renames/Left'
import RenamesRight from '@renderer/components/renames/Right'
import { useTranslation } from 'react-i18next'
// import { capitalizeFirstLetter } from '@renderer/utils/text'

function Slides() {
  const { t } = useTranslation()
  // const targetFiles = useSelector((state: RootState) => state.renames.targetFiles)
  // const setting = useSelector((state: RootState) => state.renames.setting)
  const { setIsOpen, setSteps, setCurrentStep } = useTour()
  const dispatch = useDispatch()

  return (
    <div>
      Slides
    </div>
  )
}

export default Slides
