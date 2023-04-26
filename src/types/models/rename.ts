export interface RenameSetting {
  isAutoDuplicatedName: boolean
  isKeepOriginal: boolean
  isDefaultOpenCard: boolean
  isDefaultCheckedOnLoad: boolean
  isNotFirstPage: boolean
  isNotFirstLoad: boolean
}

export type RenameSettingUpdate = Partial<RenameSetting>

