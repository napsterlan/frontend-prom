'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastContext';
import { ReactNode, useState } from 'react';
import Image from 'next/image';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface Action<T> {
  label: string;
  onClick?: (item: T) => void | Promise<void>;
  variant?: 'default' | 'destructive';
  showConfirm?: boolean;
  confirmMessage?: string;
  href?: (item: T) => string;
  successMessage?: string;
  errorMessage?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions: Action<T>[];
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  baseUrl: string;
  idField?: keyof T;
  pathField?: keyof T;
}

export function DataTable<T>({ 
  data,
  columns,
  actions,
  currentPage,
  totalPages,
  totalRecords,
  baseUrl,
  idField = 'id' as keyof T,
  pathField = 'slug' as keyof T,
}: DataTableProps<T>) {
  const router = useRouter();
  const { showToast } = useToast();
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    action: Action<T> | null;
    item: T | null;
  }>({
    isOpen: false,
    action: null,
    item: null
  });

  const handleAction = async (action: Action<T>, item: T) => {
    if (action.showConfirm) {
      setConfirmDialog({
        isOpen: true,
        action,
        item
      });
      return;
    }
    
    try {
      if (action.href) {
        router.push(action.href(item));
        return;
      }
      
      await action.onClick?.(item);
      router.refresh();
      showToast(
        action.successMessage || 'Операция выполнена успешно', 
        'success'
      );
    } catch (error) {
      console.error('Ошибка:', error);
      showToast(
        action.errorMessage || 'Произошла ошибка', 
        'error'
      );
    }
  };

  const handleConfirm = async () => {
    const { action, item } = confirmDialog;
    if (!action || !item) return;

    try {
      await action.onClick?.(item);
      router.refresh();
      showToast(
        action.successMessage || 'Операция выполнена успешно', 
        'success'
      );
    } catch (error) {
      console.error('Ошибка:', error);
      showToast(
        action.errorMessage || 'Произошла ошибка', 
        'error'
      );
    }
    
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
    
    setTimeout(() => {
      setConfirmDialog({
        isOpen: false,
        action: null,
        item: null
      });
    }, 300);
  };

  const handlePageChange = (page: number) => {
    router.push(`${baseUrl}?page=${page}`);
    router.refresh();
  };

  const renderPaginationControls = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === i
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Всего записей: {totalRecords}
        </div>
        <div className="flex items-center">
          {currentPage > 1 && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-3 py-1 mx-1 rounded bg-gray-200 hover:bg-gray-300"
            >
              ←
            </button>
          )}
          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-1 mx-1 rounded bg-gray-200 hover:bg-gray-300"
              >
                1
              </button>
              {startPage > 2 && <span className="mx-2">...</span>}
            </>
          )}
          {pages}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="mx-2">...</span>}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-1 mx-1 rounded bg-gray-200 hover:bg-gray-300"
              >
                {totalPages}
              </button>
            </>
          )}
          {currentPage < totalPages && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-3 py-1 mx-1 rounded bg-gray-200 hover:bg-gray-300"
            >
              →
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            {columns?.map((column) => (
              <th 
                key={column.key}
                className={`py-2 px-3 ${column.align ? `text-${column.align}` : 'text-left'}`}
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
            {actions?.length > 0 && (
              <th className="py-2 px-3 text-right">Действия</th>
            )}
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {data?.map((item) => (
            <tr key={String(item[idField])} className="border-b border-gray-200 hover:bg-gray-100">
              {columns?.map((column) => (
                <td 
                  key={column.key} 
                  className={`py-2 px-3 ${column.align ? `text-${column.align}` : 'text-left'}`}
                >
                  {column.render 
                    ? column.render(item)
                    : String(item[column.key as keyof T] || '')}
                </td>
              ))}
              {actions?.length > 0 && (
                <td className="py-2 px-3">
                  <div className="flex flex-wrap justify-end gap-3">
                    {actions?.map((action, index) => (
                      action.href ? (
                        <Link
                          key={index}
                          href={action.href(item)}
                          className={`${
                            action.variant === 'destructive'
                              ? 'bg-red-500 hover:bg-red-600'
                              : 'bg-blue-500 hover:bg-blue-600'
                          } text-white px-3 py-1 rounded`}
                        >
                          {action.label}
                        </Link>
                      ) : (
                        <button
                          key={index}
                          onClick={() => handleAction(action, item)}
                          className={`${
                            action.variant === 'destructive'
                              ? 'bg-red-500 hover:bg-red-600'
                              : 'bg-blue-500 hover:bg-blue-600'
                          } text-white px-3 py-1 rounded`}
                        >
                          {action.label}
                        </button>
                      )
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {renderPaginationControls()}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => {
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          setTimeout(() => {
            setConfirmDialog({
              isOpen: false,
              action: null,
              item: null
            });
          }, 300);
        }}
        onConfirm={handleConfirm}
        title={confirmDialog.action?.label || ''}
        message={confirmDialog.action?.confirmMessage || ''}
        confirmText="Подтвердить"
        cancelText="Отмена"
      />
    </div>
  );
}