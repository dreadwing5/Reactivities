import React, { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";

// Define the Invoice type based on our mock data structure
type Invoice = {
  id: number;
  attributes: {
    companyCode: string;
    vendorCode: string;
    invoiceNumber: string;
    documentNumber: string;
    amountInDocumentCurrency: number;
    documentCurrency: string;
    historicMatchesCount: number;
    status: string;
    assignedUser: {
      firstName: string;
      lastName: string;
    };
    updatedBy: {
      firstName: string;
      lastName?: string;
    };
    updatedOn: string;
  };
};

// Full mock data set
const data: Invoice[] = [
  {
    id: 1001,
    attributes: {
      companyCode: "CC001",
      vendorCode: "VC123",
      invoiceNumber: "INV-2024-001",
      documentNumber: "DOC-001",
      amountInDocumentCurrency: 1500.5,
      documentCurrency: "USD",
      historicMatchesCount: 2,
      status: "New",
      assignedUser: {
        firstName: "John",
        lastName: "Doe",
      },
      updatedBy: {
        firstName: "Jane",
        lastName: "Smith",
      },
      updatedOn: "2024-09-10T14:30:00Z",
    },
  },
  {
    id: 1002,
    attributes: {
      companyCode: "CC002",
      vendorCode: "VC456",
      invoiceNumber: "INV-2024-002",
      documentNumber: "DOC-002",
      amountInDocumentCurrency: 2750.75,
      documentCurrency: "EUR",
      historicMatchesCount: 0,
      status: "Pending",
      assignedUser: {
        firstName: "Alice",
        lastName: "Johnson",
      },
      updatedBy: {
        firstName: "Bob",
        lastName: "Williams",
      },
      updatedOn: "2024-09-11T09:15:00Z",
    },
  },
  {
    id: 1003,
    attributes: {
      companyCode: "CC003",
      vendorCode: "VC789",
      invoiceNumber: "INV-2024-003",
      documentNumber: "DOC-003",
      amountInDocumentCurrency: 500.0,
      documentCurrency: "GBP",
      historicMatchesCount: 1,
      status: "New",
      assignedUser: {
        firstName: "Charlie",
        lastName: "Brown",
      },
      updatedBy: {
        firstName: "System",
      },
      updatedOn: "2024-09-12T11:45:00Z",
    },
  },
  {
    id: 1004,
    attributes: {
      companyCode: "CC001",
      vendorCode: "VC101",
      invoiceNumber: "INV-2024-004",
      documentNumber: "DOC-004",
      amountInDocumentCurrency: 3000.25,
      documentCurrency: "USD",
      historicMatchesCount: 3,
      status: "Pending",
      assignedUser: {
        firstName: "David",
        lastName: "Miller",
      },
      updatedBy: {
        firstName: "Emily",
        lastName: "Davis",
      },
      updatedOn: "2024-09-13T16:20:00Z",
    },
  },
  {
    id: 1005,
    attributes: {
      companyCode: "CC004",
      vendorCode: "VC202",
      invoiceNumber: "INV-2024-005",
      documentNumber: "DOC-005",
      amountInDocumentCurrency: 1200.0,
      documentCurrency: "JPY",
      historicMatchesCount: 0,
      status: "New",
      assignedUser: {
        firstName: "Frank",
        lastName: "Wilson",
      },
      updatedBy: {
        firstName: "System",
      },
      updatedOn: "2024-09-14T08:50:00Z",
    },
  },
];

const DataTable: React.FC = () => {
  const columns = useMemo<MRT_ColumnDef<Invoice>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Record Number",
        size: 150,
      },
      {
        accessorKey: "attributes.companyCode",
        header: "Company Code",
        size: 150,
      },
      {
        accessorKey: "attributes.vendorCode",
        header: "Vendor Code",
        size: 150,
      },
      {
        accessorKey: "attributes.invoiceNumber",
        header: "Invoice Number",
        size: 200,
      },
      {
        accessorKey: "attributes.documentNumber",
        header: "Document Number",
        size: 200,
      },
      {
        accessorKey: "attributes.amountInDocumentCurrency",
        header: "Amount",
        size: 150,
        Cell: ({ row }) =>
          `${
            row.original.attributes.documentCurrency
          } ${row.original.attributes.amountInDocumentCurrency.toFixed(2)}`,
      },
      {
        accessorKey: "attributes.historicMatchesCount",
        header: "Duplicate Entries",
        size: 150,
      },
      {
        accessorKey: "attributes.status",
        header: "Status",
        size: 150,
      },
      {
        accessorKey: "attributes.assignedUser",
        header: "Assigned To",
        size: 200,
        Cell: ({ row }) =>
          `${row.original.attributes.assignedUser.firstName} ${row.original.attributes.assignedUser.lastName}`,
      },
      {
        accessorKey: "attributes.updatedBy",
        header: "Updated By",
        size: 200,
        Cell: ({ row }) => {
          const updatedBy = row.original.attributes.updatedBy;
          return updatedBy.lastName
            ? `${updatedBy.firstName} ${updatedBy.lastName}`
            : updatedBy.firstName;
        },
      },
      {
        accessorKey: "attributes.updatedOn",
        header: "Updated On",
        size: 200,
        Cell: ({ row }) =>
          new Date(row.original.attributes.updatedOn).toLocaleString(),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnFilters: true,
    enableSorting: true,
    enablePagination: true,
    enableFullScreenToggle: false,
    initialState: {
      pagination: { pageSize: 5, pageIndex: 0 },
      sorting: [{ id: "id", desc: false }],
    },
  });

  return <MaterialReactTable table={table} />;
};

export default DataTable;
