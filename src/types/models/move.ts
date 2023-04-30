export interface MoveDirectory {
  path: string
  kbd?: string[]
}

export interface MoveSetting {
  isAutoDuplicatedName: boolean
  isKeepOriginal: boolean
  isDefaultCheckedOnLoad: boolean
  isNotFirstPage: boolean
  isNotFirstLoad: boolean
}

export type MoveSettingUpdate = Partial<MoveSetting>
