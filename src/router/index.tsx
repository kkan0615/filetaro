import { Route, Routes } from 'react-router'
import Home from '@renderer/pages/index'
import RootLayout from '@renderer/layouts/RootLayout'
import Playgrounds from '@renderer/pages/playgrounds'
import Move from '@renderer/layouts/Move'
import RenameLayout from '@renderer/layouts/Rename'
import { lazy } from 'react'

const Moves = lazy(() => import('@renderer/pages/moves'))
const Renames = lazy(() => import('@renderer/pages/renames'))

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="playgrounds" element={<Playgrounds />} />
        <Route path="moves" element={<Move />}>
          <Route index element={<Moves />} />
        </Route>
        <Route path="renames" element={<RenameLayout />}>
          <Route index element={<Renames />} />
        </Route>
      </Route>
    </Routes>
  )
}
