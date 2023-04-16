import { TargetFiles } from '@renderer/types/models/targetFiles'
import { Image } from '@chakra-ui/react'
import { AiOutlineFile } from 'react-icons/all'

interface Props {
  slideTargetFileByIndex: TargetFiles | null
  assetUrl: string
}

function MovesSlideShowPreviewElement({ slideTargetFileByIndex, assetUrl }: Props) {
  // No file
  if (!slideTargetFileByIndex) {
    return (
      <div className="text-4xl">
        No data
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
