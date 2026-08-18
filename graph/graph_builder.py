import pandas as pd
import networkx as nx


def build_transaction_graph(csv_path):
    """
    Build a directed transaction graph from a CSV file.

    Nodes:
        Wallet addresses

    Edges:
        Transactions between wallets

    Edge attributes:
        amount
        timestamp
        transaction_id
    """

    transactions = pd.read_csv(csv_path)

    graph = nx.DiGraph()

    for _, transaction in transactions.iterrows():

        sender = transaction["sender"]
        receiver = transaction["receiver"]
        amount = float(transaction["amount"])
        timestamp = transaction["timestamp"]
        transaction_id = transaction["transaction_id"]

        graph.add_node(sender)
        graph.add_node(receiver)

        graph.add_edge(
            sender,
            receiver,
            amount=amount,
            timestamp=timestamp,
            transaction_id=transaction_id
        )

    return graph


if __name__ == "__main__":

    csv_path = "data/transactions.csv"

    transaction_graph = build_transaction_graph(csv_path)

    print("Transaction Graph Created")
    print("-------------------------")

    print("Number of wallets:", transaction_graph.number_of_nodes())
    print("Number of connections:", transaction_graph.number_of_edges())

    print("\nWallets:")

    for wallet in transaction_graph.nodes:
        print(wallet)

    print("\nConnections:")

    for sender, receiver, data in transaction_graph.edges(data=True):

        print(
            f"{sender} → {receiver} | "
            f"Amount: {data['amount']} | "
            f"Time: {data['timestamp']}"
        )