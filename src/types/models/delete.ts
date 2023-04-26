export interface DeleteSetting {
  isDefaultRecursive: boolean
  isDefaultOpenCard: boolean
  isNotFirstPage: boolean
}

export type DeleteSettingUpdate = Partial<DeleteSetting>

