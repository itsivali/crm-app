import React from 'react';
import ReceiptList from '../components/ReceiptList';


function Receipts() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Receipts</h1>
            <ReceiptList />
        </div>
    );
}

export default Receipts;