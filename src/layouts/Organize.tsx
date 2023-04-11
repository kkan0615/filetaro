import { Outlet } from 'react-router'
import { Suspense } from 'react'
import CLoading from '@renderer/components/commons/Loading'

function OrganizeLayout() {
  return (
    <div>
      <Suspense fallback={<CLoading />}>
        <Outlet />
      </Suspense>
    </div>
  )
}

export default OrganizeLayout
