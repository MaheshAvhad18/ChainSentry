function analyzeGraph(wallets, transactions) {
    const graphData = new Map();

    wallets.forEach(wallet => {
        graphData.set(wallet.wallet, {
            wallet: wallet.wallet,
            mlRiskScore: Number(wallet.risk_score),
            incomingTransactions: 0,
            outgoingTransactions: 0,
            incomingVolume: 0,
            outgoingVolume: 0,
            connectedWallets: new Set(),
            incomingWallets: new Set(),
            outgoingWallets: new Set(),
            largeTransactions: 0,
            reciprocalWallets: new Set()
        });
    });

    transactions.forEach(transaction => {
        const sender = transaction.sender;
        const receiver = transaction.receiver;
        const amount = Number(transaction.amount);

        if (!graphData.has(sender) || !graphData.has(receiver)) {
            return;
        }

        const senderData = graphData.get(sender);
        const receiverData = graphData.get(receiver);

        senderData.outgoingTransactions++;
        receiverData.incomingTransactions++;
        senderData.outgoingVolume += amount;
        receiverData.incomingVolume += amount;

        senderData.connectedWallets.add(receiver);
        receiverData.connectedWallets.add(sender);
        senderData.outgoingWallets.add(receiver);
        receiverData.incomingWallets.add(sender);

        if (amount >= 10000) {
            senderData.largeTransactions++;
            receiverData.largeTransactions++;
        }
    });

    graphData.forEach(walletData => {
        walletData.outgoingWallets.forEach(otherWallet => {
            const otherData = graphData.get(otherWallet);

            if (otherData && otherData.outgoingWallets.has(walletData.wallet)) {
                walletData.reciprocalWallets.add(otherWallet);
            }
        });
    });

    return Array.from(graphData.values()).map(walletData => {
        const mlScore = walletData.mlRiskScore;
        const largeTxScore = Math.min(100, walletData.largeTransactions * 25);
        const connectionScore = Math.min(100, walletData.connectedWallets.size * 15);
        const reciprocalScore = Math.min(100, walletData.reciprocalWallets.size * 30);
        const totalVolume = walletData.incomingVolume + walletData.outgoingVolume;
        const volumeScore = Math.min(100, (totalVolume / 50000) * 100);
        const graphScore =
            largeTxScore * 0.30 +
            connectionScore * 0.20 +
            reciprocalScore * 0.30 +
            volumeScore * 0.20;
        const combinedScore = mlScore * 0.60 + graphScore * 0.40;

        let riskLevel = "LOW";
        if (combinedScore >= 70) {
            riskLevel = "HIGH";
        } else if (combinedScore >= 40) {
            riskLevel = "MEDIUM";
        }

        const suspicionReasons = [];
        if (mlScore >= 70) {
            suspicionReasons.push("High ML anomaly score");
        }
        if (walletData.largeTransactions > 0) {
            suspicionReasons.push(`${walletData.largeTransactions} large transaction(s)`);
        }
        if (walletData.reciprocalWallets.size > 0) {
            suspicionReasons.push(
                `Reciprocal transfers with ${walletData.reciprocalWallets.size} wallet(s)`
            );
        }
        if (walletData.connectedWallets.size >= 3) {
            suspicionReasons.push("Highly connected wallet");
        }
        if (totalVolume >= 30000) {
            suspicionReasons.push("High transaction volume");
        }

        return {
            wallet: walletData.wallet,
            ml_risk_score: Number(mlScore.toFixed(2)),
            graph_suspicion_score: Number(graphScore.toFixed(2)),
            combined_risk_score: Number(combinedScore.toFixed(2)),
            risk_level: riskLevel,
            incoming_transactions: walletData.incomingTransactions,
            outgoing_transactions: walletData.outgoingTransactions,
            incoming_volume: Number(walletData.incomingVolume.toFixed(2)),
            outgoing_volume: Number(walletData.outgoingVolume.toFixed(2)),
            total_volume: Number(totalVolume.toFixed(2)),
            connections: walletData.connectedWallets.size,
            connected_wallets: Array.from(walletData.connectedWallets),
            large_transactions: walletData.largeTransactions,
            reciprocal_wallets: walletData.reciprocalWallets.size,
            suspicion_reasons: suspicionReasons
        };
    }).sort((first, second) =>
        second.combined_risk_score - first.combined_risk_score
    );
}

module.exports = { analyzeGraph };