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
            newDirectoryPath = prompt(capitalizeFirstLetter(i18n.t('texts.prompts.duplicatedNameAt')),
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
      newFileName = prompt(capitalizeFirstLetter(i18n.t('texts.prompts.duplicatedNameAt', { at: newPath })),
        `${splitName.join('')} (${i++}).${file.ext}`) || ''
    }
    // If user cancel to prompt
    if (!newFileName) {
      toast(capitalizeFirstLetter(i18n.t('texts.alerts.cancelTypeNameWarning', { name: file.name })), {
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
 * @return {boolean} - it returns false if cancel
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
    if (!newPath) return false

    if (isCopy) {
      // Copy file to new path
      await copyFile(file.path, newPath)
    } else {
      // Move file to new path
      await renameFile(file.path, newPath)
    }

    return true
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
    const path = file.path.replace(file.name, '')
    newFileName = parseKeywords({
      ...file,
      name: newFileName,
    })
    let newFileNameWithPath = `${path}${newFileName}`

    let i = 1
    // Get file extension
    const replacedName = newFileName.replace(`.${file.ext}`, '')
    while (await exists(newFileNameWithPath)) {
      console.log('test?', file.path, newFileNameWithPath)
      // New file name
      // Automatically set the file name
      if (isAutoDuplicatedName) {
        newFileName = `${replacedName.replace(` (${i - 1})`, '')} (${i++}).${file.ext}`
        newFileNameWithPath = `${path}${newFileName}`
      } else {
        newFileName = prompt(capitalizeFirstLetter(i18n.t('texts.prompts.duplicatedNameAt', { name: newFileName })),
          `${replacedName} (${i++}).${file.ext}`) || ''
        newFileNameWithPath = `${path}${newFileName}`
      }
    }
    if (isKeepOriginal) {
      await copyFile(file.path, newFileNameWithPath)
    } else {
      await renameFile(file.path, newFileNameWithPath)
    }
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
