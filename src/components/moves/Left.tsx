import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { HTMLProps, useEffect, useMemo, useState } from 'react'
import { path } from '@tauri-apps/api'
import { AiOutlineFile, AiOutlineHome, BiSlideshow, MdDeleteForever } from 'react-icons/all'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineDelete } from 'react-icons/ai'
import { listen, UnlistenFn } from '@tauri-apps/api/event'
import { Link } from 'react-router-dom'
import { getTargetFileTypeByExt, TargetFile, TargetFileType } from '@renderer/types/models/targetFile'
import {
  addTargetFile,
  removeTargetFile, setMovesSlideIndex,
  updateTargetFileCheckByIndex
} from '@renderer/stores/slices/moves'
import AddFilesFromDirectoryDialog from '@renderer/components/dialogs/AddFilesFromDirectory'
import { RootState } from '@renderer/stores'
import MovesSlideShow from '@renderer/components/moves/SlideShow'
import IndeterminateCheckbox from '@renderer/components/forms/IndeterminateCheckbox'
import CTable from '@renderer/components/commons/libs/Table'
import { deleteTargetFiles } from '@renderer/utils/file'
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { Card, CardBody, Flex, IconButton, Tooltip } from '@chakra-ui/react'
import AddFileBtn from '@renderer/components/buttons/AddFile'
import { useTranslation } from 'react-i18next'
import { capitalizeFirstLetter } from '@renderer/utils/text'
import { TableMeta } from '@renderer/types/libs/table'

function IndeterminatePreview({
  path,
  fileType,
  ...rest
}: { path: string, fileType: TargetFileType } & HTMLProps<HTMLInputElement>) {
  // const assetUrl = convertFileSrc(path)
  const [assetUrl, setAssetUrl] = useState('')

  useEffect(() => {
    loadFile()
  }, [fileType, path])

  const loadFile = async () => {
    if (fileType === 'image') {
      const assetUrl = convertFileSrc(path)
      setAssetUrl(assetUrl)
    }
  }

  if (fileType === 'image') {
    return (
      <div className="text-center max-w-[52px]">
        <img
          className="w-full h-full"
          src={assetUrl}
          alt={path}
        />
      </div>
    )
  }

  return (
    <div className="flex justify-center">
      <AiOutlineFile />
    </div>
  )
}

function MovesLeft() {
  const { t } = useTranslation()
  const targetFiles = useSelector((state: RootState) => state.moves.targetFiles)
  const checkedTargetFiles = useSelector((state: RootState) => state.moves.targetFiles.filter(targetFileEl => targetFileEl.checked))
  const isAllUnchecked = useSelector((state: RootState) => state.moves.targetFiles.some(targetFileEl => targetFileEl.checked))
  const setting = useSelector((state: RootState) => state.moves.setting)
  const dispatch = useDispatch()

  const [rowSelection, setRowSelection] = useState({})
  const [isSlideOpen, setIsSlideOpen] = useState(false)

  useEffect(() => {
    const unlisten = listen<string[]>('tauri://file-drop', async (event) => {
      const filePaths = event.payload
      await Promise.all(
        (filePaths as string[]).map(async (filePathEl) => {
          const ext = await path.extname(filePathEl)
          dispatch(
            addTargetFile({
              // ...file,
              name: await path.basename(filePathEl),
              type: getTargetFileTypeByExt(ext),
              ext,
              checked: false,
              path: filePathEl,
            })
          )
        })
      )
    }).catch(e => {
      console.error(e)
      toast(capitalizeFirstLetter(t('texts.alerts.addFilesError')), {
        type: 'error'
      })
    })

    return () => {
      const run = async () => {
        if (unlisten) {
          const unlistenValue = await unlisten as UnlistenFn
          unlistenValue()
        }
      }

      run()
    }
  }, [])

  const columnHelper = createColumnHelper<TargetFile>()
  const columns = useMemo(() => [
    columnHelper.accessor('checked', {
      id: 'checked',
      header: ({ table }) => (
        <div className="text-center">
          <IndeterminateCheckbox
            {...{
              id: 'selection-checkbox-th',
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        </div>
      ),
      meta: {
        className: 'sticky left-0',
      },
    }),
    columnHelper.accessor('path', {
      id: 'preview',
      header: 'Preview',
      cell: (info) => (
        <IndeterminatePreview
          {...{
            path: info.getValue(),
            fileType: info.row.original.type,
            checked: info.row.getIsSelected(),
            disabled: !info.row.getCanSelect(),
            indeterminate: info.row.getIsSomeSelected(),
            onChange: info.row.getToggleSelectedHandler(),
          }}
        />
      ),
      meta: {
        className: 'text-center',
      },
    }),
    columnHelper.accessor('name', {
      header: t('labels.name').toString(),
      cell: (info) => info.getValue(),
      meta: {
        className: 'max-w-[240px]',
        tooltip: true,
      } as TableMeta,
    }),
    columnHelper.accessor('path', {
      header: t('labels.path').toString(),
      cell: (info) => info.getValue(),
      meta: {
        className: 'max-w-[240px]',
        tooltip: true,
      } as TableMeta,
    }),
    columnHelper.accessor('type', {
      header: t('labels.type').toString(),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('name', {
      id: 'action',
      header: t('labels.actions').toString(),
      cell: ({ row }) => (
        <Tooltip label={t('pages.moves.tooltips.startSlideShow')}>
          <IconButton
            onClick={() => startSlideShowByIndex(row.index)}
            variant="ghost"
            aria-label={t('pages.moves.tooltips.startSlideShow')}
            icon={<BiSlideshow className="text-2xl" />}
          />
        </Tooltip>
      ),
    }),
    // columnHelper.accessor((row) => row.lastName, {
    //   id: 'lastName',
    //   cell: (info) => <i>{info.getValue()}</i>,
    //   header: () => <span>Last Name</span>,
    //   footer: (info) => info.column.id,
    // }),
    // columnHelper.accessor('age', {
    //   header: () => 'Age',
    //   cell: (info) => info.renderValue(),
    //   footer: (info) => info.column.id,
    // }),
  ], [targetFiles.length])

  const table = useReactTable({
    data: targetFiles,
    columns,
    state: {
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
  })

  /**
   * Change row selection in Redux when rowSelection is changed
   */
  useEffect(() => {
    const rows = table.getSelectedRowModel().rows

    const indexList = rows.map((rowEl) => rowEl.index)
    targetFiles
      .filter((targetFileEl) => targetFileEl.checked)
      .map((targetFileEl, index) => {
        if (!indexList.includes(index)) {
          dispatch(
            updateTargetFileCheckByIndex({
              isCheck: false,
              index: index,
            })
          )
        }
      })

    rows.map((rowEl) => {
      dispatch(
        updateTargetFileCheckByIndex({
          isCheck: true,
          index: rowEl.index,
        })
      )
    })
  }, [rowSelection])

  useEffect(() => {
    if (checkedTargetFiles.length === 0) {
      table.resetRowSelection(false)
    }
  }, [targetFiles])

  /**
   * Add selected files
   */
  const addFiles = async (filePaths: string[]) => {
    try {
      await Promise.all(
        filePaths.map(async (filePathEl, index) => {
          dispatch(
            addTargetFile({
              name: await path.basename(filePathEl),
              type: getTargetFileTypeByExt(await path.extname(filePathEl)),
              ext: await path.extname(filePathEl),
              checked: setting.isDefaultCheckedOnLoad,
              path: filePathEl,
            })
          )

          const key = targetFiles.length + index
          setRowSelection(prevState => ({
            ...prevState,
            [key]: setting.isDefaultCheckedOnLoad,
          }))
        })
      )
    } catch (e) {
      console.error(e)
      toast(capitalizeFirstLetter(t('texts.alerts.addFilesError')), {
        type: 'error'
      })
    }
  }

  const startSlideShowByIndex = (index: number) => {
    if (index <= targetFiles.length) {
      dispatch(setMovesSlideIndex(index))
      table.resetRowSelection(false)
      toggleOpen()
    }
  }

  /**
   * Load files from directory
   * @param files {TargetFile} - files from directory
   */
  const loadFiles = async (files: TargetFile[]) => {
    files.map((fileEl, index) => {
      dispatch(
        addTargetFile({
          ...fileEl,
          checked: setting.isDefaultCheckedOnLoad,
        })
      )
      const key = targetFiles.length + index
      setRowSelection(prevState => ({
        ...prevState,
        [key]: setting.isDefaultCheckedOnLoad,
      }))
    })
  }

  /**
   * Just remove checked files in list
   */
  const removeCheckedFiles = () => {
    targetFiles
      .filter((targetFileEl) => targetFileEl.checked)
      .map((targetFileEl) => {
        dispatch(removeTargetFile(targetFileEl.path))
      })

    table.resetRowSelection(false)
  }

  /**
   * Delete files permanently
   */
  const deleteCheckedFiles = async () => {
    const checkedTargetFiles = targetFiles
      .filter((targetFileEl) => targetFileEl.checked)
    const isSuccess = await deleteTargetFiles(checkedTargetFiles)

    if (isSuccess) {
      checkedTargetFiles
        .map((targetFileEl) => {
          dispatch(removeTargetFile(targetFileEl.path))
        })

      table.resetRowSelection(false)
    }
  }

  const toggleOpen = () => {
    if (isSlideOpen) {
      dispatch(setMovesSlideIndex(-1))
    }
    setIsSlideOpen((prev) => !prev)
  }

  return (
    <div
      className="h-full flex flex-col relative"
      style={{
        width: '75%', // w-9/12 not working because of important
      }}
    >
      {isSlideOpen && <MovesSlideShow isOpen={isSlideOpen} toggleOpen={toggleOpen} />}
      <div className="min-h-0 mb-2 shrink p-2">
        <Card className="p-0">
          <CardBody padding={0} className="px-2 py-1">
            <Flex alignItems="center">
              <Link to="/">
                <Tooltip label={capitalizeFirstLetter(t('tooltips.home'))}>
                  <IconButton
                    variant="ghost"
                    aria-label={t('tooltips.home')}
                    icon={<AiOutlineHome className="text-2xl" />}
                  />
                </Tooltip>
              </Link>
              <AddFileBtn onSelected={addFiles} />
              <AddFilesFromDirectoryDialog onAddFiles={loadFiles} />
              {
                targetFiles.length > 0 &&
                <Tooltip label={t('pages.moves.tooltips.startSlideShow')}>
                  <IconButton
                    id="start-slide-show-button"
                    onClick={() => startSlideShowByIndex(0)}
                    variant="ghost"
                    aria-label={t('pages.moves.tooltips.startSlideShow')}
                    icon={<BiSlideshow className="text-2xl" />}
                  />
                </Tooltip>
              }
              {isAllUnchecked &&
                <Tooltip label={capitalizeFirstLetter(t('tooltips.removeFilesFromList'))}>
                  <IconButton
                    id="remove-file-button"
                    onClick={removeCheckedFiles}
                    variant="ghost"
                    aria-label="{capitalizeFirstLetter(t('tooltips.removeFilesFromList'))}"
                    icon={<AiOutlineDelete className="text-2xl" />}
                  />
                </Tooltip>}
              <div className="mx-auto" />
              {isAllUnchecked &&
                <Tooltip label={capitalizeFirstLetter(t('tooltips.deleteFiles'))}>
                  <IconButton
                    id="delete-file-button"
                    onClick={deleteCheckedFiles}
                    variant="ghost"
                    aria-label={capitalizeFirstLetter(t('tooltips.deleteFiles'))}
                    icon={<MdDeleteForever className="text-2xl" />}
                  />
                </Tooltip>}
            </Flex>
          </CardBody>
        </Card>
      </div>
      <div className="grow h-1 overflow-auto px-2 pb-2">
        <CTable table={table} />
      </div>
    </div>
  )
}

export default MovesLeft
