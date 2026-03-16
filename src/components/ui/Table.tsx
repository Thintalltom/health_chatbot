import React from 'react';

export interface TableColumn<T> {
    key: keyof T;
    label: string;
    width?: string;
    render?: (value: any, row: T) => React.ReactNode;
}

export interface TableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    rowKey: keyof T;
    actions?: (row: T) => React.ReactNode;
    className?: string;
    rowClassName?: string;
    headerClassName?: string;
    bodyClassName?: string;
}

export function Table<T>({
    columns,
    data,
    rowKey,
    actions,
    className = '',
    rowClassName = 'hover:bg-[#FAFAFA] transition-colors group',
    headerClassName = 'bg-[#F4F5F6] border-b border-[#EDEDED]',
    bodyClassName = 'divide-y divide-[#EDEDED]'
}: TableProps<T>) {
    return (
        <div className={`rounded-[20px] border border-[#EDEDED] overflow-hidden flex-1 flex flex-col ${className}`}>
            <div className="overflow-x-auto flex flex-col">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className={headerClassName}>
                            {columns.map((column) => (
                                <th
                                    key={String(column.key)}
                                    className={`py-4 px-5 font-mulish font-bold text-[14px] text-[#7A7A7A] ${column.width || ''}`}
                                >
                                    {column.label}
                                </th>
                            ))}
                            {actions && (
                                <th className="py-4 px-5 font-mulish font-bold text-[14px] text-[#7A7A7A] w-[10%] text-center">
                                    Action
                                </th>
                            )}
                        </tr>
                    </thead>
                </table>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '380px' }}>
                <table className="w-full text-left border-collapse">
                    <tbody className={bodyClassName}>
                        {data.map((row) => (
                            <tr key={String(row[rowKey])} className={rowClassName}>
                                {columns.map((column) => (
                                    <td
                                        key={`${String(row[rowKey])}-${String(column.key)}`}
                                        className={`py-4 px-5 font-mulish text-[16px] text-[#080E0D] ${column.key === 'name' ? 'h-[76px]' : ''}`}
                                    >
                                        {column.render
                                            ? column.render(row[column.key], row)
                                            : String(row[column.key])}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="py-4 px-5 text-center">
                                        {actions(row)}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
