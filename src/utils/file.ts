import { exists, removeFile, renameFile } from '@tauri-apps/api/fs'
import { ask } from '@tauri-apps/api/dialog'
import { toast } from 'react-toastify'
import dayjs from '@renderer/utils/libs/dayjs'
import store, { RootState } from '@renderer/stores'
import { TargetFiles } from '@renderer/types/models/targetFiles'
import { DefaultDateFormat } from '@renderer/types/models/setting'
import { removeOrganizeTargetFileByPath } from '@renderer/stores/slices/organizes'

/**
 * Check the file name. If the file name is existed, prompt file name.
 * @param targetFile: File
 * @param directoryPath - Directory path
 * @param isAutoDuplicatedName - true, no prompt
 */
export const checkAndPromptFileName = async ({ file, directoryPath, isAutoDuplicatedName } : {
  file: TargetFiles
  directoryPath: string
  isAutoDuplicatedName: boolean
}) => {
  let newPath = `${directoryPath}/${file.name}`
  // Check duplicated file name
  // Number of increment
  let i = 1
  // Get file extension
  const splitName = file.name.split('.')
  splitName.pop()
  // Loop for check whether file name exists
  while (await exists(newPath)) {
    // New file name
    let newFileName = ''
    // Automatically set the file name
    if (isAutoDuplicatedName) {
      newFileName = `${splitName.join('')} (${i++}).${file.ext}`
    } else {
      newFileName = prompt(`${file.name} name is already exists, type new name of it`,
        `${splitName.join('')} (${i++}).${file.ext}`) || ''
    }
    // If user cancel to prompt
    if (!newFileName) {
      toast(`Cancel to move file, ${file.name}`, {
        type: 'warning'
      })
      return ''
    }
    // Set new path
    newPath = `${directoryPath}/${newFileName}`
  }

  return newPath
}

export const moveOrCopyFile = async ({ file, directoryPath, isCopy = false, isAutoDuplicatedName = false }: {
  file: TargetFiles
  directoryPath: string
  isCopy: boolean
  isAutoDuplicatedName: boolean
}) => {
  try {
    const newPath = await checkAndPromptFileName({
      file: file,
      directoryPath,
      isAutoDuplicatedName,
    })
    // Move file to new path
    await renameFile(file.path, newPath)
  }
  catch (e) {
    console.error(e)
    throw e
  }
}

/**
 * Replace the all keywords and then Rename the file name.
 * @param file
 * @param newFileName
 * @param isAutoDuplicatedName
 */
export const renameTargetFile = async ({ file, newFileName, isAutoDuplicatedName }: {
  file: TargetFiles
  newFileName: string
  isAutoDuplicatedName: boolean
  dateTimeFormat?: string
}) => {
  try {
    const path = file.path.replace(file.name, '')
    newFileName = parseKeywords({
      ...file,
      name: newFileName,
    })
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
 * @param files - Delete all files
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

/**
 * Parse all keywords in sting
 */
export const parseKeywords = (file: TargetFiles) => {
  const state = store.getState() as RootState
  let fileName = file.name

  // Change date
  let dateTimeFormat = state.applications.setting.dateFormat
  if (state.applications.setting.timeFormat) dateTimeFormat += ` ${state.applications.setting.timeFormat}`
  // Change today
  if (fileName.includes('$[today]')) {
    fileName = fileName.replaceAll('$[today]', dayjs().format(dateTimeFormat || DefaultDateFormat))
  }
  // Change extension
  if (fileName.includes('$[ext]')) {
    fileName = fileName.replaceAll('$[ext]', file.ext)
  }
  // Change type
  if (fileName.includes('$[type]')) {
    fileName = fileName.replaceAll('$[type]', file.type)
  }

  return fileName
}
