'use client'

import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUpDown, Search, TrendingUp, DollarSign, Users, Target } from 'lucide-react'
import { Simulation } from '@/types/simulation'

const columnHelper = createColumnHelper<Simulation>()

interface SimulationTableProps {
  simulations: Simulation[]
  onStartNewSimulation: () => void
}

export default function SimulationTable({ simulations, onStartNewSimulation }: SimulationTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 p-0 font-semibold"
          >
            Simulation Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue('name')}</div>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => {
          const status = row.getValue('status') as string
          return (
            <Badge
              variant={
                status === 'completed'
                  ? 'default'
                  : status === 'running'
                  ? 'secondary'
                  : 'destructive'
              }
            >
              {status}
            </Badge>
          )
        },
      }),
      columnHelper.accessor('revenue', {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 p-0 font-semibold"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Revenue
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue('revenue'))
          const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(amount)
          return <div className="font-medium">{formatted}</div>
        },
      }),
      columnHelper.accessor('profit', {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 p-0 font-semibold"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Profit
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue('profit'))
          const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(amount)
          return (
            <div className={`font-medium ${amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatted}
            </div>
          )
        },
      }),
      columnHelper.accessor('market_share', {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 p-0 font-semibold"
          >
            <Target className="mr-2 h-4 w-4" />
            Market Share
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const value = parseFloat(row.getValue('market_share'))
          return <div className="font-medium">{value.toFixed(1)}%</div>
        },
      }),
      columnHelper.accessor('customer_satisfaction', {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 p-0 font-semibold"
          >
            <Users className="mr-2 h-4 w-4" />
            Satisfaction
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const value = parseFloat(row.getValue('customer_satisfaction'))
          return <div className="font-medium">{value.toFixed(1)}/5.0</div>
        },
      }),
      columnHelper.accessor('created_at', {
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 p-0 font-semibold"
          >
            Date Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const date = new Date(row.getValue('created_at'))
          return <div>{date.toLocaleDateString()}</div>
        },
      }),
    ],
    []
  )

  const table = useReactTable({
    data: simulations,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  })

  if (simulations.length === 0) {
    return (
      <Card className="bg-[var(--card-bg)] border-[var(--border)]">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="text-6xl">🎯</div>
            <h3 className="text-xl font-semibold text-[var(--text)]">No Simulations Yet</h3>
            <p className="text-muted-foreground max-w-md">
              Start your first marketing simulation to see how your strategies perform in different scenarios.
            </p>
            <Button 
              onClick={onStartNewSimulation}
              className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
            >
              Start Your First Simulation
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[var(--card-bg)] border-[var(--border)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-[var(--accent)]">Simulation History</CardTitle>
          <Button 
            onClick={onStartNewSimulation}
            className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
          >
            Start New Simulation
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search simulations..."
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-[var(--border)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-[var(--border)]">
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="h-12 px-4 text-left align-middle font-medium">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-[var(--border)] hover:bg-muted/50 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="p-4 align-middle">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="h-24 text-center">
                      No results found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Showing {table.getFilteredRowModel().rows.length} of {simulations.length} simulation(s)
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
