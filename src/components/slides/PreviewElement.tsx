import { Image } from '@chakra-ui/react'
import { AiOutlineFile } from 'react-icons/ai'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { TargetFile } from '@renderer/types/models/targetFile'
import { RootState } from '@renderer/stores'
import { Command, open } from '@tauri-apps/api/shell'


interface Props {
  targetFile: TargetFile | null
  assetUrl: string
}

function SlidesPreviewElement({ targetFile, assetUrl }: Props) {
  const { t } = useTranslation()

  const setting = useSelector((state: RootState) => state.moves.setting)

  /**
   * Click file handler
   * @TODO: There is error to open file currently. Please update it later.
   */
  const handleClick = async () => {
    if (!targetFile) return
    // await open(targetFile.path)
    // const cmd = new Command('cmd') // May be easier to have an actual script file to execute here
    // const child = await cmd.spawn()
    // await child.write(`START ""  "${targetFile.path}"`)
    // await child.kill()
  }


  // No file
  if (!targetFile) {
    return (
      <div className="text-4xl">
        {t('labels.noData')}
      </div>
    )
  }
  // Image
  if (targetFile.type === 'image') {
    return (
      <div className="text-center w-full h-full p-2">
        <Image
          className="w-full h-full"
          fit="scale-down"
          src={assetUrl}
          alt={targetFile.name}
        />
      </div>
    )
  }
  // Video
  if (targetFile.type === 'video') {
    return (
      <div className="text-center max-w-full max-h-full p-2">
        <video src={assetUrl} controls autoPlay={setting.isAutoPlay}>
          Your browser does not support the video tag.
        </video>
      </div>
    )
  }
  if (targetFile.type === 'audio') {
    return (
      <div className="text-center max-w-full max-h-full p-2">
        <audio src={assetUrl} controls autoPlay={setting.isAutoPlay}>
          Your browser does not support the audio tag.
        </audio>
      </div>
    )
  }
  // Just file
  return (
    <div onClick={handleClick}>
      <div className="flex justify-center mb-2">
        <AiOutlineFile className="text-4xl"/>
      </div>
      <div className="text-xl">
        {targetFile.name}
      </div>
    </div>
  )
}

export default SlidesPreviewElement
