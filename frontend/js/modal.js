import { getWalletInvestigation } from "./api.js";
import { element, riskBadgeClass } from "./dom.js";

export async function showWalletDetails(walletId) {
    try {
        const data = await getWalletInvestigation(walletId);

        setText(["details-wallet"], data.wallet);
        setText(["details-ml-score", "details-risk-score"], Number(data.risk.ml_score).toFixed(2));
        setText(["details-graph-score"], Number(data.risk.graph_score).toFixed(2));
        setText(["details-combined-score"], Number(data.risk.combined_score).toFixed(2));

        const riskBadge = element("details-risk-badge");
        riskBadge.textContent = data.risk.level;
        riskBadge.className = `badge ${riskBadgeClass(data.risk.level)}`;
        setText(["details-risk-level"], data.risk.level);

        setText(["details-incoming-transactions", "details-incoming"], data.network.incoming_transactions);
        setText(["details-outgoing-transactions", "details-outgoing"], data.network.outgoing_transactions);
        setText(["details-connections"], data.network.connections);
        setText(["details-reciprocal"], data.network.reciprocal_wallets);
        setText(["details-volume"], Number(data.activity.total_volume).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }));
        setText(["details-large-transactions"], data.activity.large_transactions);

        renderSignals(data.suspicion_reasons);
        renderConnectedWallets(data.network.connected_wallets);
        renderTransactions(data.transactions);

        element("wallet-details").classList.remove("hidden");
        document.body.style.overflow = "hidden";
    } catch (error) {
        console.error("Failed to load wallet investigation:", error);
    }
}

function renderSignals(reasons) {
    const container = element("details-signals");
    if (!container) {
        return;
    }
    container.innerHTML = "";

    if (reasons.length === 0) {
        container.innerHTML = `<div class="no-signals">No significant suspicious signals detected</div>`;
        return;
    }

    reasons.forEach(reason => {
        const signal = document.createElement("div");
        signal.className = "investigation-signal";
        signal.innerHTML = `<span class="signal-icon">!</span><span>${reason}</span>`;
        container.appendChild(signal);
    });
}

function renderConnectedWallets(wallets) {
    const container = element("connected-wallet-list");
    if (!container) {
        return;
    }
    container.innerHTML = "";

    if (wallets.length === 0) {
        container.innerHTML = `<span class="no-connections">No connected wallets</span>`;
        return;
    }

    wallets.forEach(walletId => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "connected-wallet";
        button.textContent = walletId;
        button.addEventListener("click", () => showWalletDetails(walletId));
        container.appendChild(button);
    });
}

function renderTransactions(transactions) {
    setText(["details-transactions"], transactions.length);
    element("transaction-count").textContent =
        `${transactions.length} transaction${transactions.length === 1 ? "" : "s"}`;

    const table = element("transaction-table");
    table.innerHTML = "";

    transactions.forEach(transaction => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${transaction.transaction_id}</td>
            <td>${transaction.sender}</td>
            <td>${transaction.receiver}</td>
            <td>${Number(transaction.amount).toFixed(2)}</td>
            <td>${transaction.timestamp}</td>
        `;
        table.appendChild(row);
    });
}

export function setupModal() {
    element("close-details").addEventListener("click", closeWalletDetails);
    element("wallet-details").addEventListener("click", event => {
        if (event.target.id === "wallet-details") {
            closeWalletDetails();
        }
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeWalletDetails();
        }
    });
}

function setText(ids, value) {
    ids.forEach(id => {
        const target = element(id);
        if (target) {
            target.textContent = value;
        }
    });
}

function closeWalletDetails() {
    element("wallet-details").classList.add("hidden");
    document.body.style.overflow = "";
}
