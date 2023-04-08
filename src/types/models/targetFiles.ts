const ImageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'jfif']
const VideoExts = ['webm', 'mkv', 'mpg', 'mpeg', 'avi', 'wmv', 'rm', 'ram', 'swf', 'flv', 'ogg' ,'mp4']
const AudioExts = ['mid', 'midi', 'wma', 'aac', 'wav', 'mp3']

const TargetFileTypes = ['image', 'video', 'audio', 'pdf', 'file'] as const
export type TargetFileType = typeof TargetFileTypes[number]
export const getTargetFileTypeByExt = (ext: string): TargetFileType => {
  const lowerExt = ext.toLowerCase()
  if (ImageExts.includes(lowerExt)) {
    return 'image'
  } else if(VideoExts.includes(lowerExt)) {
    return 'video'
  } else if(AudioExts.includes(lowerExt)) {
    return 'audio'
  } else {
    return 'file'
  }
}

export interface TargetFiles {
  name: string
  path: string
  checked: boolean
  type: TargetFileType
  ext: string
  // mime: string
  // buffer: Buffer
}

export type ResFile = Omit<TargetFiles, 'checked' | 'path'>
export type UpdateTargetFiles = Partial<TargetFiles>
