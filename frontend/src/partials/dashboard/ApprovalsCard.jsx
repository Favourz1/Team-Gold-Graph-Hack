import React,{useEffect, useState} from 'react';
import {formatDateToMMDDYY} from "../../utils/Utils"

function DashboardCard07() {
    const [numberOfApprovals, setNumberOfApprovals] = useState(5);
    const [approvals, setApprovals] = useState([]);
    const [approvalsHeader, setApprovalsHeader] = useState(["tokenId","owner","approved","blockNumber", "transactionHash", "blockTimestamp"]);



    async function fetchData() {
        const url = 'https://api.studio.thegraph.com/query/47879/teamtrustgold/version/latest'; 

        const headers = {
            'Content-Type': 'application/json',
        };

        const requestBody = {
            query: `
            query {
                approvals(first: ${numberOfApprovals}) {
                id
                owner
                approved
                tokenId
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
                setApprovals(data.data.approvals) 
            }
        } catch (error) {
            console.error('GraphQL fetch error:', error);
        }
    }


    useEffect(()=>{
        fetchData();
        
    },[numberOfApprovals])
    useEffect(()=>{
        console.log(approvals)
        
    },[approvals])
  return (
    <div className="col-span-full  bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Approved Transactions</h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-slate-300">
            {/* Table header */}
            <thead className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm">
              <tr>
                <th className="p-2">
                  <div className="font-semibold text-left">Token ID</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Owner</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Approved</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">BlockNumber</div>
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
                            {key === "tokenId" ? (
                                <div className="flex items-center">
                                <svg width="25px" height="25px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="m 8 1 c -1.65625 0 -3 1.34375 -3 3 s 1.34375 3 3 3 s 3 -1.34375 3 -3 s -1.34375 -3 -3 -3 z m -1.5 7 c -2.492188 0 -4.5 2.007812 -4.5 4.5 v 0.5 c 0 1.109375 0.890625 2 2 2 h 8 c 1.109375 0 2 -0.890625 2 -2 v -0.5 c 0 -2.492188 -2.007812 -4.5 -4.5 -4.5 z m 0 0" fill="#2e3436" />
                                </svg>
                                <div className="text-slate-800 dark:text-slate-100">{item[key]}</div>
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
