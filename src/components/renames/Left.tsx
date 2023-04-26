import { Link } from 'react-router-dom'
import { AiOutlineDelete, AiOutlineHome } from 'react-icons/ai'
import { path } from '@tauri-apps/api'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import { Card, CardBody, Flex, IconButton, Tooltip } from '@chakra-ui/react'
import {
  addRenameTargetFile,
  removeRenameTargetFileByPath,
  updateRenameTargetFileCheckByIndex
} from '@renderer/stores/slices/renames'
import { getTargetFileTypeByExt, TargetFile } from '@renderer/types/models/targetFile'
import IndeterminateCheckbox from '@renderer/components/forms/IndeterminateCheckbox'
import { RootState } from '@renderer/stores'
import CTable from '@renderer/components/commons/libs/Table'
import { MdDeleteForever } from 'react-icons/all'
import { deleteTargetFiles } from '@renderer/utils/file'
import AddFilesFromDirectoryDialog from '@renderer/components/AddFilesFromDirectoryDialog'
import AddFileBtn from '@renderer/components/buttons/AddFile'

function RenamesLeft() {
  const targetFiles = useSelector((state: RootState) => state.renames.targetFiles)
  const checkedTargetFiles = useSelector((state: RootState) => state.renames.targetFiles.filter(targetFileEl => targetFileEl.checked))
  const isAllUnchecked = useSelector((state: RootState) => state.renames.targetFiles.some(targetFileEl => targetFileEl.checked))
  const setting = useSelector((state: RootState) => state.renames.setting)
  const dispatch = useDispatch()

  const [rowSelection, setRowSelection] = useState({})

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
    }),
    columnHelper.accessor('name', {
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('path', {
      header: 'original path',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('type', {
      cell: (info) => info.getValue(),
    }),
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
            updateRenameTargetFileCheckByIndex({
              isCheck: false,
              index: index,
            })
          )
        }
      })

    rows.map((rowEl) => {
      dispatch(
        updateRenameTargetFileCheckByIndex({
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
            addRenameTargetFile({
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
      toast('Error to add files', {
        type: 'error'
      })
    }
  }

  /**
   * Load files from directory
   * @param files {TargetFile} - files from directory
   */
  const loadFiles = async (files: TargetFile[]) => {
    files.map((fileEl, index) => {
      dispatch(
        addRenameTargetFile({
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
        dispatch(removeRenameTargetFileByPath(targetFileEl.path))
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
          dispatch(removeRenameTargetFileByPath(targetFileEl.path))
        })

      table.resetRowSelection(false)
    }
  }

  return (
    <div
      className="h-full flex flex-col relative"
      style={{
        width: '75%', // w-9/12 not working because of important
      }}
    >
      <div className="min-h-0 mb-2 shrink p-2">
        <Card className="p-0">
          <CardBody padding={0} className="px-2 py-1">
            <Flex alignItems="center">
              <Link to="/">
                <Tooltip label="Home">
                  <IconButton
                    variant="ghost"
                    aria-label="home"
                    icon={<AiOutlineHome className="text-2xl" />}
                  />
                </Tooltip>
              </Link>
              <AddFileBtn onSelected={addFiles} />
              <AddFilesFromDirectoryDialog onAddFiles={loadFiles} />
              {isAllUnchecked &&
                <Tooltip label="Remove files from list">
                  <IconButton
                    onClick={removeCheckedFiles}
                    variant="ghost"
                    aria-label="Start slide show"
                    icon={<AiOutlineDelete className="text-2xl" />}
                  />
                </Tooltip>}
              <div className="mx-auto" />
              {isAllUnchecked &&
                <Tooltip label="Delete files permanently">
                  <IconButton
                    onClick={deleteCheckedFiles}
                    variant="ghost"
                    aria-label="Delete files permanently"
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

export default RenamesLeft
