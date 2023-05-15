import { TargetFile } from '@renderer/types/models/targetFile'
import { Image } from '@chakra-ui/react'
import { AiOutlineFile } from 'react-icons/all'
import { useTranslation } from 'react-i18next'

interface Props {
  slideTargetFileByIndex: TargetFile | null
  assetUrl: string
}

function MovesSlideShowPreviewElement({ slideTargetFileByIndex, assetUrl }: Props) {
  const { t } = useTranslation()

  // No file
  if (!slideTargetFileByIndex) {
    return (
      <div className="text-4xl">
        {t('labels.noData')}
      </div>
    )
  }
  // Image
  if (slideTargetFileByIndex.type === 'image') {
    return (
      <div className="text-center max-w-full max-h-full p-2">
        <Image
          objectFit='cover'
          src={assetUrl}
          alt={slideTargetFileByIndex.name}
        />
      </div>
    )
  }
  // Video
  if (slideTargetFileByIndex.type === 'video') {
    return (
      <div className="text-center max-w-full max-h-full p-2">
        <video src={assetUrl} controls>
          Your browser does not support the video tag.
        </video>
      </div>
    )
  }
  if (slideTargetFileByIndex.type === 'audio') {
    return (
      <div className="text-center max-w-full max-h-full p-2">
        <audio src={assetUrl} controls>
          Your browser does not support the audio tag.
        </audio>
      </div>
    )
  }
  // Just file
  return (
    <div>
      <div className="flex justify-center mb-2">
        <AiOutlineFile className="text-4xl"/>
      </div>
      <div className="text-xl">
        {slideTargetFileByIndex.name}
      </div>
    </div>
  )
}

export default MovesSlideShowPreviewElement
