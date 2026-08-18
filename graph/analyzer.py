import pandas as pd
import networkx as nx

from graph_builder import build_transaction_graph


def analyze_wallets(csv_path):
    """
    Analyze wallet behavior using the transaction graph
    and transaction dataset.
    """

    # Load transaction data
    transactions = pd.read_csv(csv_path)

    # Build graph
    graph = build_transaction_graph(csv_path)

    wallet_features = []

    for wallet in graph.nodes:

        # Transactions involving this wallet
        wallet_transactions = transactions[
            (transactions["sender"] == wallet) |
            (transactions["receiver"] == wallet)
        ]

        # Incoming transactions
        incoming = transactions[
            transactions["receiver"] == wallet
        ]

        # Outgoing transactions
        outgoing = transactions[
            transactions["sender"] == wallet
        ]

        # Graph features
        in_degree = graph.in_degree(wallet)
        out_degree = graph.out_degree(wallet)

        # Transaction features
        total_transactions = len(wallet_transactions)

        total_incoming = incoming["amount"].sum()
        total_outgoing = outgoing["amount"].sum()

        avg_transaction = (
            wallet_transactions["amount"].mean()
            if total_transactions > 0
            else 0
        )

        # Unique connected wallets
        connected_wallets = set(
            graph.predecessors(wallet)
        ).union(
            set(graph.successors(wallet))
        )

        unique_connections = len(connected_wallets)

        wallet_features.append({
            "wallet": wallet,
            "in_degree": in_degree,
            "out_degree": out_degree,
            "total_transactions": total_transactions,
            "total_incoming": total_incoming,
            "total_outgoing": total_outgoing,
            "avg_transaction": avg_transaction,
            "unique_connections": unique_connections
        })

    return pd.DataFrame(wallet_features)


if __name__ == "__main__":

    csv_path = "data/transactions.csv"

    features = analyze_wallets(csv_path)

    print("\nWallet Behavioral Analysis")
    print("==========================")

    print(features.to_string(index=False))

    # Save features for ML
    output_path = "ml/data/wallet_features.csv"

    features.to_csv(output_path, index=False)

    print(f"\nML dataset saved to: {output_path}")