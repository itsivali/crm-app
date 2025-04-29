import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ReceiptList() {
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/receipts');
                setReceipts(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch receipts');
                setLoading(false);
            }
        };

        fetchReceipts();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-6 py-3 text-left">Receipt #</th>
                        <th className="px-6 py-3 text-left">Date Paid</th>
                        <th className="px-6 py-3 text-left">Amount</th>
                        <th className="px-6 py-3 text-left">Payment Method</th>
                    </tr>
                </thead>
                <tbody>
                    {receipts.map((receipt) => (
                        <tr key={receipt._id} className="border-b hover:bg-gray-50">
                            <td className="px-6 py-4">{receipt.receipt_number}</td>
                            <td className="px-6 py-4">
                                {new Date(receipt.date_paid).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                                ${receipt.amount_paid.toFixed(2)}
                            </td>
                            <td className="px-6 py-4">{receipt.payment_method}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ReceiptList;