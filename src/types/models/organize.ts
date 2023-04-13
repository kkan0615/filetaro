export interface OrganizeSetting {
  isAutoDuplicatedName: boolean
  isKeepOriginal: boolean
  isDefaultOpenCard: boolean
  isDefaultCheckedOnLoad: boolean
}

export type OrganizeSettingUpdate = Partial<OrganizeSetting>

