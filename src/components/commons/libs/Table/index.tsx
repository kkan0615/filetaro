import { flexRender, Table as TTable } from '@tanstack/react-table'
import { TargetFile } from '@renderer/types/models/targetFile'
import { TableContainer, Table, Thead, Tr, Tbody, Th, Td, Tooltip } from '@chakra-ui/react'

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
              {headerGroup.headers.map((headerEl) => (
                <Th className={`truncate ${(headerEl.column.columnDef.meta as any)?.className}`} maxWidth={headerEl.getSize()} key={headerEl.id}>
                  {headerEl.isPlaceholder
                    ? null
                    : flexRender(headerEl.column.columnDef.header, headerEl.getContext())}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id}>
              {row.getVisibleCells().map((cellEl) => (
                <Tooltip
                  key={cellEl.id}
                  label={(cellEl.column.columnDef.meta as any)?.tooltip ? cellEl.getContext().getValue() as string || '' : ''}
                  placement="bottom"
                >
                  <Td
                    className={`truncate ${(cellEl.column.columnDef.meta as any)?.className} ${(cellEl.column.columnDef.meta as any)?.tdClassName}`}
                  >
                    {flexRender(cellEl.column.columnDef.cell, cellEl.getContext())}
                  </Td>
                </Tooltip>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default CTable
