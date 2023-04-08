import { TargetFiles } from '@renderer/types/models/targetFiles'
import { exists, removeFile, renameFile } from '@tauri-apps/api/fs'
import { ask } from '@tauri-apps/api/dialog'
import dayjs from '@renderer/utils/libs/dayjs'
import store, { RootState } from '@renderer/stores'
import { DefaultDateFormat } from '@renderer/types/models/setting'

interface RenameFileParams {
  file: TargetFiles
  newFileName: string
  isAutoDuplicatedName: boolean
  dateTimeFormat?: string
}

export const renameTargetFile = async ({ file, newFileName, isAutoDuplicatedName }: RenameFileParams) => {
  try {
    const path = file.path.replace(file.name, '')
    newFileName = parseKeywords(newFileName)
    const newFileNameWithPath = `${path}${newFileName}`

    let i = 1
    // Get file extension
    const replacedName = newFileName.replace(`.${file.ext}`, '')
    while (await exists(newFileNameWithPath)) {
      // New file name
      // Automatically set the file name
      if (isAutoDuplicatedName) {
        newFileName = `${replacedName} (${i++}).${file.ext}`
      } else {
        newFileName = prompt(`${newFileName} name is already exists, type new name of it`,
          `${replacedName} (${i++}).${file.ext}`) || ''
      }
    }

    await renameFile(file.path, newFileNameWithPath)
    return { newFileNameWithPath, newFileName }
  } catch (e) {
    console.error(e)
    throw e
  }
}

/**
 * delete files
 * @param files
 * @return {boolean} - returns true if it's success, else return false
 */
export const deleteTargetFiles = async (files: TargetFiles[]) => {
  try {
    const yes = await ask('Would like to delete the files permanently?', {
      title: 'Delete files permanently',
      type: 'warning'
    })
    if (!yes) return false

    await Promise.all(files
      .map(async (targetFileEl) => {
        await removeFile(targetFileEl.path)
      }))

    return true
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const parseKeywords = (fileName:string) => {
  const state = store.getState() as RootState
  let dateTimeFormat = state.applications.setting.dateFormat
  if (state.applications.setting.timeFormat) dateTimeFormat += ` ${state.applications.setting.timeFormat}`
  // if (fileName.includes('$[createdAt]')) {
  //   fileName = fileName.replaceAll('$[createdAt]', '')
  // }
  //
  // if (fileName.includes('$[updatedAt]')) {
  //   fileName = fileName.replaceAll('$[updatedAt]', '')
  // }
  if (fileName.includes('$[today]')) {
    fileName = fileName.replaceAll('$[today]', dayjs().format(dateTimeFormat || DefaultDateFormat))
  }

  return fileName
}
