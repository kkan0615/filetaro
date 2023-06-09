/**
 * isAutoDuplicatedName: Automatically set duplicated file name
 * isKeepOriginal: Keep original file (same as copy file)
 * isDefaultCheckedOnLoad: Check all loaded files in default
 * isNotFirstPage: It's the first time to visit this page, for tour feature
 * isNotFirstLoad: It's the first time to load files, for tour feature
 * isAutoPlay: Automatically play audio and video
 */
export interface SlideSetting {
  isAutoDuplicatedName: boolean
  isKeepOriginal: boolean
  isDefaultCheckedOnLoad: boolean
  isNotFirstPage: boolean
  isNotFirstLoad: boolean
  isAutoPlay: boolean
}


export const NO_SLIDE_INDEX = -1
