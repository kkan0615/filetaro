export const MoveSorts = ['+createdAt', '-createdAt', '+name', '-name', '+path', '-path'] as const
export type MoveSortType = typeof MoveSorts[number]
