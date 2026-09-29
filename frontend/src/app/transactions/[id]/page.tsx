import TransactionDetailClient from './TransactionDetailClient';

export default function Page({ params }: { params: { id: string } }) {
    return <TransactionDetailClient id={params.id} />;
}
