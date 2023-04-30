export interface OrganizeSetting {
  isAutoDuplicatedName: boolean
  isKeepOriginal: boolean
  isDefaultOpenCard: boolean
  isDefaultCheckedOnLoad: boolean
  isOverrideDirectory: boolean
  isNotFirstPage: boolean
  isNotFirstLoad: boolean
}

export type OrganizeSettingUpdate = Partial<OrganizeSetting>

