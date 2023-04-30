import { useEffect, useState } from 'react'
import { getVersion } from '@tauri-apps/api/app'
import { checkUpdate, installUpdate } from '@tauri-apps/api/updater'
import { ask } from '@tauri-apps/api/dialog'
import { relaunch } from '@tauri-apps/api/process'
import { toast } from 'react-toastify'
import CDisplayLabel from '@renderer/components/commons/labels/Display'
import LanguageSelect from '@renderer/components/forms/LanguageSelect'
import { FormControl, FormLabel } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { capitalizeFirstLetter } from '@renderer/utils/text'

function SettingDialogProgram() {
  const { t } = useTranslation()

  const [version, setVersion] = useState('')

  useEffect(() => {
    getVersion()
      .then(value => setVersion(value))
  }, [])

  // @Comment-out: Feature is preparing ...
  // const handleCheckAndUpdate = async () => {
  //   try {
  //     const { shouldUpdate, manifest } = await checkUpdate()
  //     if (shouldUpdate) {
  //       const yes = await ask('Would like to update now?', {
  //         title: `New version (${manifest?.version}) is available`,
  //         type: 'info'
  //       })
  //       if (yes) {
  //         await installUpdate()
  //         await relaunch()
  //       }
  //     }
  //   } catch (e) {
  //     console.error(e)
  //     toast('Error to check and update', {
  //       type: 'error'
  //     })
  //   }
  // }

  return (
    <div>
      <FormControl className="mb-4">
        <FormLabel>{capitalizeFirstLetter(t('labels.language'))}</FormLabel>
        <LanguageSelect />
      </FormControl>
      <CDisplayLabel>
        {capitalizeFirstLetter(t('labels.currentVersion'))}
      </CDisplayLabel>
      <div className="space-y-2">
        <div className="text-lg font-bold">
          {version}
        </div>
        {/* @Comment-out: Feature is preparing... */}
        {/*<div className="tooltip tooltip-bottom" data-tip="Check and update">*/}
        {/*  <button type="button" onClick={handleCheckAndUpdate} className="btn btn-sm btn-secondary">*/}
        {/*    Check and update*/}
        {/*  </button>*/}
        {/*</div>*/}
      </div>
    </div>
  )
}

export default SettingDialogProgram
