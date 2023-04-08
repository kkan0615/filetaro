import { flexRender, Table as TTable } from '@tanstack/react-table'
import { TargetFiles } from '@renderer/types/models/targetFiles'
import { TableContainer, Table, Thead, Tr, Tbody, Th, Td } from '@chakra-ui/react'

interface Props {
  table: TTable<TargetFiles>
}

function CTable({ table }: Props) {
  return (
    <TableContainer>
      <Table variant='simple'>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default CTable
