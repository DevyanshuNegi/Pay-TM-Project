"use client"
import { Card } from "@repo/ui/card"

// A separate client component for formatting dates
const TransactionItem = ({ transaction }: {
    transaction: {
        time: Date,
        amount: number,
        status: string,
        provider: string,
        id?: string,
    }
}) => {
    // Parse the date if it's a string (which it likely is when received from API)
    const dateDisplay = transaction.time instanceof Date
        ? transaction.time.toDateString()
        : new Date(transaction.time).toDateString();

    return (
        <div className="flex justify-between" key={transaction.id}>
            <div>
                <div className="text-sm">
                    Received INR
                </div>
                <div className="text-slate-600 text-xs">
                    {dateDisplay}
                </div>
            </div>
            <div className="flex flex-col justify-center">
                + Rs {transaction.amount}
            </div>
        </div>
    );
};

export const OnRampTransactions = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        status: string,
        provider: string,
        id?: string,
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">
        <div className="pt-2">
            {transactions.map((t, index) => (
                <TransactionItem
                    key={t.id || `transaction-${index}`}
                    transaction={t}
                />
            ))}
        </div>
    </Card>
}