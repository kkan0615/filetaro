import { copyFile, createDir, exists, FileEntry, readDir, removeFile, renameFile } from '@tauri-apps/api/fs'
import { ask } from '@tauri-apps/api/dialog'
import { toast } from 'react-toastify'
import dayjs from '@renderer/utils/libs/dayjs'
import store, { RootState } from '@renderer/stores'
import { getTargetFileTypeByExt, TargetFile } from '@renderer/types/models/targetFile'
import { DefaultDateFormat } from '@renderer/types/models/setting'
import { path } from '@tauri-apps/api'
import { capitalizeFirstLetter } from '@renderer/utils/text'
import i18n from '@renderer/i18n'


export const findAllFilesInDirectory = async ({ directoryPath ,isRecursive }: {
  directoryPath: string
  isRecursive: boolean
}) => {
  // Formatted files
  const files: TargetFile[] = []
  // All files
  const entries = (await readDir(directoryPath, { recursive: isRecursive }))
  const recursive = async (innerEntries: FileEntry[]) => {
    for (let i = 0; i < innerEntries.length; i++) {
      const entryEl = innerEntries[i]
      // Pass empty directory
      if (entryEl.children !== undefined && entryEl.children.length === 0) {
        continue
      }
      // Recursive folder
      if (entryEl.children && entryEl.children.length) {
        await recursive(entryEl.children)
        continue
      }
      // extract extension
      const ext = await path.extname(entryEl.path)
      files.push({
        name: entryEl.name || '',
        type: getTargetFileTypeByExt(ext),
        ext,
        checked: false,
        path: entryEl.path,
      })
    }
  }

  await recursive(entries)

  return files
}

/**
 * Generate file name
 * @param fileName
 * @param directoryPath
 * @param isPassPrompt
 */
export const generateFileName = async ({
  fileName,
  directoryPath,
  isPassPrompt,
}: {
  fileName: string
  directoryPath: string
  isPassPrompt: boolean
}) => {
  try {
    let newPath = `${directoryPath}/${fileName}`
    // Check duplicated file name
    // Number of increment
    let i = 1
    // Get file extension
    const splitName = fileName.split('.')
    const ext = splitName.pop()
    // Loop for check whether file name exists
    while (await exists(newPath)) {
      // New file name
      let newFileName = ''
      // Automatically set the file name
      if (isPassPrompt) {
        newFileName = `${splitName.join('').replace(` (${i - 1})`, '')} (${i++}).${ext}`
      } else {
        newFileName = prompt(capitalizeFirstLetter(i18n.t('texts.prompts.duplicatedNameAt', { at: newPath })),
          `${splitName.join('')} (${i++}).${ext}`) || ''
      }
      // If user cancel to prompt
      if (!newFileName) {
        toast(capitalizeFirstLetter(i18n.t('texts.alerts.cancelTypeNameWarning', { name: fileName })), {
          type: 'warning'
        })
        return ''
      }
      // Set new path
      newPath = `${directoryPath}/${newFileName}`
    }
    return newPath
  } catch (e) {
    console.error(e)
    throw e
  }
}

/**
 * Generate file name
 * @param fileName
 * @param directoryPath
 * @param isPassPrompt
 */
export const generateDirectoryName = async ({
  directoryPath,
  isPassPrompt,
}: {
  directoryPath: string
  isPassPrompt: boolean
}) => {
  try {
    let newName = directoryPath
    // Check duplicated file name
    // Number of increment
    let i = 1
    // Get file extension
    // Loop for check whether file name exists
    while (await exists(newName)) {
      // Automatically set the file name
      if (isPassPrompt) {
        newName = `${newName.replace(` (${i - 1})`, '')} (${i++})`
      } else {
        newName = prompt(capitalizeFirstLetter(i18n.t('texts.prompts.duplicateName')),
          `${newName} (${i++})`) || ''
      }
      // If user cancel to prompt
      if (!newName) {
        toast(capitalizeFirstLetter(i18n.t('texts.alerts.cancelTypeNameWarning', { name: newName })), {
          type: 'warning'
        })
        return ''
      }
    }

    return newName
  } catch (e) {
    console.error(e)
    throw e
  }
}

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
    if (await exists(directoryPath) && isOverride) return directoryPath

    const newDirectoryPath = await generateDirectoryName({
      directoryPath,
      isPassPrompt: isAutoDuplicatedName,
    })

    if (!newDirectoryPath) return ''

    await createDir(newDirectoryPath)
    return newDirectoryPath
  } catch (e) {
    console.error(e)
    throw e
  }
}

/**
 * Move or Copy file
 * @param file
 * @param directoryPath
 * @param isCopy - True, copy file. False, just move file
 * @param isAutoDuplicatedName
 * @return {boolean} - it returns false if cancel
 */
export const moveOrCopyFile = async ({ file, directoryPath, isCopy = false, isAutoDuplicatedName = false }: {
  file: TargetFile
  directoryPath: string
  isCopy: boolean
  isAutoDuplicatedName: boolean
}) => {
  try {
    const newPath = await generateFileName({
      fileName: file.name,
      directoryPath,
      isPassPrompt: isAutoDuplicatedName,
    })
    if (!newPath) return ''

    if (isCopy) {
      // Copy file to new path
      await copyFile(file.path, newPath)
    } else {
      // Move file to new path
      await renameFile(file.path, newPath)
    }

    return newPath
  }
  catch (e) {
    console.error(e)
    throw e
  }
}

/**
 * Replace the all keywords and then Rename or copy the file name.
 * @param file
 * @param newFileName
 * @param isKeepOriginal
 * @param isAutoDuplicatedName
 */
export const renameOrCopyTargetFile = async ({ file, newFileName, isKeepOriginal, isAutoDuplicatedName }: {
  file: TargetFile
  newFileName: string
  isAutoDuplicatedName: boolean
  isKeepOriginal: boolean
}) => {
  try {
    newFileName = parseKeywords({
      ...file,
      name: newFileName,
    })
    const directoryPath = await path.dirname(file.path)
    const newPath = await generateFileName({
      fileName: newFileName,
      directoryPath,
      isPassPrompt: isAutoDuplicatedName,
    })
    if (!newPath) return {
      newPath: '',
      newFileName,
    }

    // Keep the original file
    if (isKeepOriginal) {
      console.log(file.path, newPath)
      await copyFile(file.path, newPath)
    } else {
      // just rename it.
      await renameFile(file.path, newPath)
    }
    return { newPath, newFileName }
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
    const yes = await ask(capitalizeFirstLetter(i18n.t('texts.prompts.delete')), {
      title: capitalizeFirstLetter(i18n.t('labels.confirmDeleteTitle')),
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
