import { Store } from 'tauri-plugin-store-api'
import { StoreFileName } from '@renderer/types/store'

export const settingStore = new Store(StoreFileName.Setting)
