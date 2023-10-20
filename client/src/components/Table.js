import React, { useEffect, useState } from "react";

const transformData = (data) =>
  data.map((bill) => ({
    id: bill.Id,
    vendor: bill.VendorRef.name,
    dueDate: bill.DueDate,
    balance: bill.Balance,
    actionPerformed: bill.actionPerformed,
  }));

const headers = ["ID", "Vendor", "Due Date", "Balance", "Action Performed"];

const getBillStyle = (actionPerformed) => {
  switch (actionPerformed) {
    case "added":
      return "bg-green-200 text-green-800";
    case "modified":
      return "bg-yellow-100 text-gray-800";
    default:
      return "";
  }
};

const Table = ({ bills }) => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (bills) {
      setTableData(transformData(bills));
    }
  }, [bills]);

  return (
    <div className="relative overflow-x-auto mt-6 rounded-md">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-900 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-900">
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-6 py-3">
                {header.charAt(0).toUpperCase() + header.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.length ? (
            tableData.map((row, index) => (
              <tr
                key={index}
                className={`bg-white border-b ${getBillStyle(
                  row.actionPerformed
                )} border-gray-700`}
              >
                {Object.values(row).map((cell, index) => (
                  <td className="px-6 py-4 text-gray-900" key={index}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <p className="font-bold mt-4 w-full">No bills found</p>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
