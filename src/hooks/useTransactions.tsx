import { createContext, useState, useEffect, ReactNode, useContext } from "react"; 
import { api } from "../services/api";

interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: string;
    category: string;
    createdAt: string;
}

interface TransactionsProviderProps {
    children: ReactNode;
}

interface TransactionsInput {
    title: string
    amount: number;
    category: string;
    type: string;
}

interface TransactionsContextData {
    transactions: Transaction[];
    createTransaction: (transaction: TransactionsInput) => Promise<void>;
}

interface TransactionRequest {
    transactions: Array<Transaction>;
}

interface TransactionResponse {
    data: {
        transaction: Transaction;
    }
}
 
const TransactionsContext = createContext<TransactionsContextData>(
    {} as TransactionsContextData
);


export function TransactionsProvider({ children }: TransactionsProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        api.get<TransactionRequest>('transactions')
            .then((response) => setTransactions(response.data.transactions));
    }, []);

    async function createTransaction(transactionInput: TransactionsInput) {
        const response:TransactionResponse = await api.post('/transactions', {
            ...transactionInput,
            createdAt: new Date(),
        });
        const transaction = response.data.transaction;

        setTransactions([
            ...transactions,
            transaction
        ]);
    }

    return (
        <TransactionsContext.Provider value={{ transactions, createTransaction }}>
            {children}
        </TransactionsContext.Provider>
    )
}

export function useTransactions() {
    const context = useContext(TransactionsContext);
    return context;
}