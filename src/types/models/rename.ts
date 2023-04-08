export interface RenameSetting {
  isAutoDuplicatedName: boolean
  isKeepOriginal: boolean
  isDefaultOpenCard: boolean
  isDefaultCheckedOnLoad: boolean
}

export type RenameSettingUpdate = Partial<RenameSetting>

