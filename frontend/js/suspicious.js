import { getGraphAnalysis } from "./api.js";
import { element, riskBadgeClass } from "./dom.js";
import { showWalletDetails } from "./modal.js";

export async function loadSuspiciousWallets() {
    try {
        const data = await getGraphAnalysis();
        const wallets = data.wallets.filter(wallet =>
            wallet.risk_level === "HIGH" || wallet.combined_risk_score >= 40
        );

        element("suspicious-count").textContent = `${wallets.length} detected`;
        const table = element("suspicious-table");
        table.innerHTML = "";

        if (wallets.length === 0) {
            table.innerHTML = `<tr><td colspan="9" class="no-suspicious-wallets">No suspicious wallets detected</td></tr>`;
            return;
        }

        wallets.forEach(wallet => table.appendChild(createSuspiciousRow(wallet)));
    } catch (error) {
        console.error("Failed to load graph analysis:", error);
        element("suspicious-count").textContent = "Unavailable";
        element("suspicious-table").innerHTML =
            `<tr><td colspan="9" class="no-suspicious-wallets">Unable to load suspicious wallet analysis</td></tr>`;
    }
}

function createSuspiciousRow(wallet) {
    const row = document.createElement("tr");
    const signals = wallet.suspicion_reasons
        .map(reason => `<span class="signal">- ${reason}</span>`)
        .join("");

    row.innerHTML = `
        <td><button class="suspicious-wallet-button" type="button">${wallet.wallet}</button></td>
        <td><span class="analysis-score">${Number(wallet.ml_risk_score).toFixed(2)}</span></td>
        <td><span class="analysis-score graph-score">${Number(wallet.graph_suspicion_score).toFixed(2)}</span></td>
        <td><span class="combined-score">${Number(wallet.combined_risk_score).toFixed(2)}</span></td>
        <td><span class="badge ${riskBadgeClass(wallet.risk_level)}">${wallet.risk_level}</span></td>
        <td>${wallet.connections}</td>
        <td>${wallet.large_transactions}</td>
        <td>${wallet.reciprocal_wallets}</td>
        <td><div class="signal-list">${signals}</div></td>
    `;
    row.querySelector(".suspicious-wallet-button").addEventListener("click", () => showWalletDetails(wallet.wallet));
    return row;
}
