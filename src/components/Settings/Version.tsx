import { useEffect, useState } from 'react'
import { getVersion } from '@tauri-apps/api/app'
import { checkUpdate, installUpdate } from '@tauri-apps/api/updater'
import { ask } from '@tauri-apps/api/dialog'
import { relaunch } from '@tauri-apps/api/process'
import { toast } from 'react-toastify'
import CDisplayLabel from '@renderer/components/commons/labels/Display'

function SettingDialogVersion() {
  const [version, setVersion] = useState('')

  useEffect(() => {
    getVersion()
      .then(value => setVersion(value))
  }, [])

  const handleCheckAndUpdate = async () => {
    try {
      const { shouldUpdate, manifest } = await checkUpdate()
      if (shouldUpdate) {
        const yes = await ask('Would like to update now?', {
          title: `New version (${manifest?.version}) is available`,
          type: 'info'
        })
        if (yes) {
          await installUpdate()
          await relaunch()
        }
      }
    } catch (e) {
      console.error(e)
      toast('Error to check and update', {
        type: 'error'
      })
    }
  }

  return (
    <div>
      <CDisplayLabel>
        Current Version
      </CDisplayLabel>
      <div className="space-y-2">
        <div className="text-lg font-bold">
          {version}
        </div>
        {/*<div className="tooltip tooltip-bottom" data-tip="Check and update">*/}
        {/*  <button type="button" onClick={handleCheckAndUpdate} className="btn btn-sm btn-secondary">*/}
        {/*    Check and update*/}
        {/*  </button>*/}
        {/*</div>*/}
      </div>
    </div>
  )
}

export default SettingDialogVersion
