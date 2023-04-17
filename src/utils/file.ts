import { copyFile, createDir, exists, removeFile, renameFile } from '@tauri-apps/api/fs'
import { ask } from '@tauri-apps/api/dialog'
import { toast } from 'react-toastify'
import dayjs from '@renderer/utils/libs/dayjs'
import store, { RootState } from '@renderer/stores'
import { TargetFile } from '@renderer/types/models/targetFile'
import { DefaultDateFormat } from '@renderer/types/models/setting'

/**
 * If directory in the path exists, create directory or Override based on isOverride parameter.
 * @param directoryPath
 * @param isOverride - Use existed directory
 * @param isAutoDuplicatedName - true, no prompt
 * @return {string} - new directory path
 */
export const overrideOrCreateDirectory = async ({ directoryPath, isOverride, isAutoDuplicatedName }: {
  directoryPath: string
  isOverride: boolean
  isAutoDuplicatedName: boolean
}) => {
  try {
    const dirExists = await exists(directoryPath)
    if (dirExists) {
      if (!isOverride) {
        let newDirectoryPath = directoryPath
        // Check duplicated file name
        // Number of increment
        let i = 1
        while (await exists(newDirectoryPath)) {
          // remove (number) name
          newDirectoryPath = newDirectoryPath.replace(` (${i - 1})`, '')
          // Automatically set the file name
          if (isAutoDuplicatedName) {
            newDirectoryPath = `${directoryPath} (${i++})`
          } else {
            newDirectoryPath = prompt(`${newDirectoryPath} is already exists, type new name of it`,
              `${newDirectoryPath} (${i++})`) || ''
          }

          // If user cancel to prompt
          if (!newDirectoryPath) {
            toast('Cancel to create directory name', {
              type: 'warning'
            })
            return ''
          }
        }
        await createDir(newDirectoryPath)
        return newDirectoryPath
      }

      return directoryPath
    }

    await createDir(directoryPath)
    return directoryPath
  } catch (e) {
    console.error(e)
    throw e
  }
}

/**
 * Check the file name. If the file name is existed, prompt file name.
 * @param targetFile: File
 * @param directoryPath - Directory path
 * @param isAutoDuplicatedName - true, no prompt
 */
export const checkAndPromptFileName = async ({ file, directoryPath, isAutoDuplicatedName } : {
  file: TargetFile
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
      // remove (number) name
      newFileName = `${splitName.join('').replace(` (${i - 1})`, '')} (${i++}).${file.ext}`
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

/**
 * Move or Copy file
 * @param file
 * @param directoryPath
 * @param isCopy - True, copy file. False, just move file
 * @param isAutoDuplicatedName
 */
export const moveOrCopyFile = async ({ file, directoryPath, isCopy = false, isAutoDuplicatedName = false }: {
  file: TargetFile
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
    if (isCopy) {
      // Copy file to new path
      await copyFile(file.path, newPath)
    } else {
      // Move file to new path
      await renameFile(file.path, newPath)
    }
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
  file: TargetFile
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
export const deleteTargetFiles = async (files: TargetFile[]) => {
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
export const parseKeywords = (file: TargetFile) => {
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
