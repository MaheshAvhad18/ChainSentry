import { getTransactions, getWallets } from "./api.js";
import { showWalletDetails } from "./modal.js";

export async function loadTransactionGraph() {
    try {
        const [transactionData, walletData] = await Promise.all([
            getTransactions(),
            getWallets()
        ]);
        const walletMap = new Map(walletData.wallets.map(wallet => [wallet.wallet, wallet]));
        const nodes = Array.from(walletMap.values()).map(createNode);
        const edges = transactionData.transactions.map(createEdge);
        const container = document.getElementById("transaction-graph");

        const network = new window.vis.Network(
            container,
            {
                nodes: new window.vis.DataSet(nodes),
                edges: new window.vis.DataSet(edges)
            },
            graphOptions()
        );

        network.on("click", params => {
            if (params.nodes.length > 0) {
                showWalletDetails(params.nodes[0]);
                return;
            }

            if (params.edges.length > 0) {
                const transaction = transactionData.transactions[params.edges[0]];
                if (transaction) {
                    alert(`Transaction\n\n${transaction.sender} -> ${transaction.receiver}\nAmount: ${transaction.amount}\nTime: ${transaction.timestamp}`);
                }
            }
        });

        network.on("doubleClick", () => network.fit({
            animation: { duration: 800, easingFunction: "easeInOutQuad" }
        }));
    } catch (error) {
        console.error("Failed to load transaction graph:", error);
    }
}

function createNode(wallet) {
    const colors = { HIGH: "#ef4444", MEDIUM: "#f59e0b", LOW: "#22c55e" };
    const sizes = { HIGH: 32, MEDIUM: 27, LOW: 22 };
    const color = colors[wallet.risk_level] || colors.LOW;

    return {
        id: wallet.wallet,
        label: wallet.wallet,
        title: `<b>${wallet.wallet}</b><br>Risk Score: ${wallet.risk_score}<br>Risk Level: ${wallet.risk_level}<br>Transactions: ${wallet.total_transactions}<br>Connections: ${wallet.unique_connections}`,
        size: sizes[wallet.risk_level] || sizes.LOW,
        color: {
            background: color,
            border: "#e2e8f0",
            highlight: { background: "#ffffff", border: color }
        },
        borderWidth: 2,
        font: { color: "#ffffff", size: 14, face: "Arial", bold: true },
        shadow: { enabled: true, color, size: 12, x: 0, y: 0 }
    };
}

function createEdge(transaction, index) {
    const amount = Number(transaction.amount);
    const large = amount >= 10000;
    const color = large ? "#ef4444" : "#475569";
    const width = large ? Math.max(3, Math.min(8, amount / 2500)) : Math.max(1, Math.min(5, amount / 3000));

    return {
        id: index,
        from: transaction.sender,
        to: transaction.receiver,
        label: amount >= 1000 ? `${(amount / 1000).toFixed(1)}K` : amount.toFixed(0),
        arrows: { to: { enabled: true, scaleFactor: 0.7 } },
        width,
        color: { color, highlight: "#60a5fa", hover: "#93c5fd" },
        title: `<b>Transaction</b><br>${transaction.sender} -> ${transaction.receiver}<br>Amount: ${amount.toFixed(2)}<br>Time: ${transaction.timestamp}`,
        font: { color: "#94a3b8", size: 10, strokeWidth: 0 },
        smooth: { type: "curvedCW", roundness: 0.15 }
    };
}

function graphOptions() {
    return {
        autoResize: true,
        physics: {
            enabled: true,
            stabilization: { enabled: true, iterations: 250 },
            barnesHut: {
                gravitationalConstant: -3500,
                centralGravity: 0.15,
                springLength: 190,
                springConstant: 0.04,
                damping: 0.09,
                avoidOverlap: 0.7
            }
        },
        interaction: {
            hover: true,
            tooltipDelay: 150,
            zoomView: true,
            dragView: true,
            dragNodes: true,
            navigationButtons: true,
            keyboard: true,
            multiselect: false
        },
        nodes: { shape: "dot", scaling: { min: 18, max: 40 } },
        edges: { selectionWidth: 3, hoverWidth: 2, smooth: { enabled: true } }
    };
}
