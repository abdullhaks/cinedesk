import React from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';

export interface ColumnType<T> {
  key: string;
  title: string;
  dataIndex?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string | number;
}

interface DataTableProps<T> {
  columns: ColumnType<T>[];
  data: T[];
  loading?: boolean;
  rowKey?: string | ((record: T) => string);
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  emptyText?: string;
  onRowClick?: (record: T) => void;
}

export function DataTable<T extends object>({
  columns,
  data,
  loading = false,
  rowKey = '_id',
  pagination,
  emptyText = 'No data available',
  onRowClick,
}: DataTableProps<T>) {
  const antdColumns: TableProps<T>['columns'] = columns.map((col) => ({
    key: col.key,
    title: col.title,
    dataIndex: col.dataIndex as any,
    render: col.render,
    width: col.width,
  }));

  return (
    <div className="card-minimal overflow-hidden p-0">
      <Table
        columns={antdColumns}
        dataSource={data}
        loading={loading}
        rowKey={rowKey}
        pagination={
          pagination
            ? {
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                onChange: pagination.onChange,
                showSizeChanger: false,
                className: 'px-6 py-4 mb-0',
              }
            : false
        }
        locale={{ emptyText }}
        onRow={(record) => ({
          onClick: () => onRowClick?.(record),
          className: onRowClick ? 'cursor-pointer hover:bg-slate-50 transition-colors' : '',
        })}
      />
    </div>
  );
}
