import React,{useEffect, useState} from 'react';
import {formatDateToMMDDYY} from "../../utils/Utils"

function DashboardCard07({setApprovedTransactions}) {
    const [numberOfApprovals, setNumberOfApprovals] = useState(5);
    const [approvals, setApprovals] = useState([]);
    const [approvalsHeader, setApprovalsHeader] = useState(["blockNumber","owner", "approved", "operator", "transactionHash", "blockTimestamp"]);



    async function fetchData() {
        const url = 'https://api.studio.thegraph.com/query/47879/teamtrustgold/version/latest'; 

        const headers = {
            'Content-Type': 'application/json',
        };

        const requestBody = {
            query: `
            query {
                approvalForAlls(first: ${numberOfApprovals}) {
                    id
                    owner
                    operator
                    approved
                    blockTimestamp
                    blockNumber
                    transactionHash
                }
            }
            `,
        };

        try {
            const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
            }

            const data = await response.json();

            if (data.errors) {
                throw new Error(`GraphQL errors data.error: ${data.errors}`);
            } else {
                setApprovals(data.data.approvalForAlls)
            }
        } catch (error) {
            console.error('GraphQL fetch error:', error);
        }
    }


    useEffect(()=>{
        fetchData();
        
    },[numberOfApprovals])
    useEffect(()=>{
        setApprovedTransactions(approvals.length) 
        
    },[approvals])
  return (
    <div className="col-span-full  bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">All Approved Transactions</h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-slate-300">
            {/* Table header */}
            <thead className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm">
              <tr>
                <th className="p-2">
                  <div className="font-semibold text-left">BlockNumber</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Owner</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Approved</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Operator</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Transaction Hash</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Time</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-700">
              {/* Row */}
                {
                   approvals && approvals.map((item) => (
                        <tr key={item.key}>
                        {approvalsHeader.map((key) => (
                            <td className="p-2" key={key}>
                            {key === "approved" ? (
                                <div className="flex items-center">
                                <div className="text-slate-800 dark:text-slate-100">{item[key] ? 'Yes' : 'No'}</div>
                                </div>
                            ) : key === "blockTimestamp" ?(
                                <div className="text-center p-2 whitespace-nowrap">{formatDateToMMDDYY(item[key])}</div>
                            ):(
                                <div className="text-center p-2">{item[key]}</div>
                            )
                            }
                            </td>
                        ))}
                        </tr>
                    ))
                    }

            </tbody>
          </table>
        </div>
        <div 
          className="flex p-2 my-3 ml-auto max-w-[200px] btn bg-indigo-500 hover:bg-indigo-600 text-white"
          onClick={()=> setNumberOfApprovals(prev => prev +5)}
        >
          Load More
        </div>
      </div>
    </div>
  );
}

export default DashboardCard07;
