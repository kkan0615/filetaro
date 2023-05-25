import { Route, Routes } from 'react-router'
import Home from '@renderer/pages/index'
import RootLayout from '@renderer/layouts/RootLayout'
import Playgrounds from '@renderer/pages/playgrounds'
import MoveLayout from '@renderer/layouts/Move'
import RenameLayout from '@renderer/layouts/Rename'
import OrganizeLayout from '@renderer/layouts/Organize'
import DeleteLayout from '@renderer/layouts/Delete'
import { lazy } from 'react'
import SlideLayout from '@renderer/layouts/Slide'

const Moves = lazy(() => import('@renderer/pages/moves'))
const Renames = lazy(() => import('@renderer/pages/renames'))
const Organizes = lazy(() => import('@renderer/pages/organizes'))
const Deletes = lazy(() => import('@renderer/pages/deletes'))
const Slides = lazy(() => import('@renderer/pages/slides'))

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="playgrounds" element={<Playgrounds />} />
        <Route path="moves" element={<MoveLayout />}>
          <Route index element={<Moves />} />
        </Route>
        <Route path="renames" element={<RenameLayout />}>
          <Route index element={<Renames />} />
        </Route>
        <Route path="organizes" element={<OrganizeLayout />}>
          <Route index element={<Organizes />} />
        </Route>
        <Route path="deletes" element={<DeleteLayout />}>
          <Route index element={<Deletes />} />
        </Route>
        <Route path="slides" element={<SlideLayout />}>
          <Route index element={<Slides />} />
        </Route>
      </Route>
    </Routes>
  )
}
