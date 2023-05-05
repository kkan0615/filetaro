import { flexRender, Table as TTable } from '@tanstack/react-table'
import { TargetFile } from '@renderer/types/models/targetFile'
import { TableContainer, Table, Thead, Tr, Tbody, Th, Td, Tooltip } from '@chakra-ui/react'
import { TableMeta } from '@renderer/types/libs/table'

interface Props {
  table: TTable<TargetFile>
}

function CTable({ table }: Props) {
  return (
    <TableContainer width="100%">
      <Table size="sm" variant='simple'>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((headerEl) => {
                const meta= headerEl.column.columnDef.meta as TableMeta
                return (
                  <Th className={meta?.className}
                    maxWidth={headerEl.getSize()} key={headerEl.id}>
                    {headerEl.isPlaceholder
                      ? null
                      : flexRender(headerEl.column.columnDef.header, headerEl.getContext())}
                  </Th>
                )
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id}>
              {row.getVisibleCells().map((cellEl) => {
                const meta: any = cellEl.column.columnDef.meta as TableMeta
                return (
                  <Td key={cellEl.id} className={`truncate ${meta?.className} ${meta?.tdClassName}`}>
                    <Tooltip
                      label={meta?.tooltip ? cellEl.getContext().getValue() as string || '' : ''}
                      placement="bottom"
                    >
                      <div>
                        {flexRender(cellEl.column.columnDef.cell, cellEl.getContext())}
                      </div>
                    </Tooltip>
                  </Td>
                )
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default CTable
