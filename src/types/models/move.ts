export interface MoveDirectory {
  path: string
  kbd?: string[]
}

export interface MoveSetting {
  isAutoDuplicatedName: boolean
  isKeepOriginal: boolean
  isDefaultCheckedOnLoad: boolean
  isFirstPageEnter: boolean
  isFirstLoad: boolean
}

export type MoveSettingUpdate = Partial<MoveSetting>
