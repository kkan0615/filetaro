import { useDispatch } from 'react-redux'
import { useTour } from '@reactour/tour'
import Splitter from '@renderer/components/Splitter'
import { useTranslation } from 'react-i18next'
import SlidesLeft from '@renderer/components/slides/Left'
import SlidesRight from '@renderer/components/slides/Right'
// import { capitalizeFirstLetter } from '@renderer/utils/text'

function Slides() {
  const { t } = useTranslation()
  // const targetFiles = useSelector((state: RootState) => state.renames.targetFiles)
  // const setting = useSelector((state: RootState) => state.renames.setting)
  const { setIsOpen, setSteps, setCurrentStep } = useTour()
  const dispatch = useDispatch()

  return (
    <Splitter left={<SlidesLeft />} right={<SlidesRight />} />
  )
}

export default Slides
