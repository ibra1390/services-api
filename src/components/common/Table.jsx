import React from "react";

export default function Table({ headers, children }) {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
      <table className="w-full text-sm text-left">
        <thead className="text-sm bg-slate-800 text-white border-b border-gray-300">
          <tr>
            {headers.map((header, index) => (
              <th key={index} scope="col" className="px-6 py-4 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">{children}</tbody>
      </table>
    </div>
  );
}
