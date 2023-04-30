// https://learn.microsoft.com/en-us/deployoffice/compat/office-file-format-reference
const ImageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'jfif']
const VideoExts = ['webm', 'mkv', 'mpg', 'mpeg', 'avi', 'wmv', 'rm', 'ram', 'swf', 'flv', 'ogg' ,'mp4']
const AudioExts = ['mid', 'midi', 'wma', 'aac', 'wav', 'mp3']
const PdfExts = ['pdf']
const WordExts = ['doc', 'docm', 'docx', 'dot', 'dotm']
const ExcelExts = ['xls', 'xlsb', 'xlsm', 'xlsx']

export const TargetFileTypes = ['image', 'video', 'audio', 'pdf', 'word', 'excel', 'file'] as const
export type TargetFileType = typeof TargetFileTypes[number]
export const getTargetFileTypeByExt = (ext: string): TargetFileType => {
  const lowerExt = ext.toLowerCase()
  if (ImageExts.includes(lowerExt)) {
    return 'image'
  } else if(VideoExts.includes(lowerExt)) {
    return 'video'
  } else if(AudioExts.includes(lowerExt)) {
    return 'audio'
  } else if(PdfExts.includes(lowerExt)) {
    return 'pdf'
  } else if(WordExts.includes(lowerExt)) {
    return 'word'
  } else if(ExcelExts.includes(lowerExt)) {
    return 'excel'
  } else {
    return 'file'
  }
}

export interface TargetFile {
  name: string
  path: string
  checked: boolean
  type: TargetFileType
  ext: string
  // mime: string
  // buffer: Buffer
}

export type ResFile = Omit<TargetFile, 'checked' | 'path'>
export type UpdateTargetFiles = Partial<TargetFile>
