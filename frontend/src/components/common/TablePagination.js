import React from 'react';
import { TablePagination as MuiTablePagination } from '@mui/material';

const TablePagination = ({ count, page, rowsPerPage, onPageChange, onRowsPerPageChange }) => {
  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3 flex items-center justify-between">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(null, page - 1)}
          disabled={page === 0}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(null, page + 1)}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{page * rowsPerPage + 1}</span> to{' '}
            <span className="font-medium">{Math.min((page + 1) * rowsPerPage, count)}</span> of{' '}
            <span className="font-medium">{count}</span> results
          </p>
        </div>
        <div>
          <MuiTablePagination
            component="div"
            count={count}
            page={page}
            onPageChange={onPageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={onRowsPerPageChange}
            rowsPerPageOptions={[25, 50, 100]}
          />
        </div>
      </div>
    </div>
  );
};

export default TablePagination;
