export interface DeleteSetting {
  isDefaultRecursive: boolean
  isDefaultOpenCard: boolean
}

export type DeleteSettingUpdate = Partial<DeleteSetting>

