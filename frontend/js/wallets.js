import { getWallets } from "./api.js";
import { element, riskBadgeClass } from "./dom.js";
import { showWalletDetails } from "./modal.js";

export async function loadWallets() {
    try {
        const data = await getWallets();
        const wallets = data.wallets;

        element("total-wallets").textContent = wallets.length;
        element("high-risk").textContent = wallets.filter(wallet => wallet.risk_level === "HIGH").length;
        element("medium-risk").textContent = wallets.filter(wallet => wallet.risk_level === "MEDIUM").length;
        element("low-risk").textContent = wallets.filter(wallet => wallet.risk_level === "LOW").length;

        const table = element("wallet-table");
        table.innerHTML = "";

        wallets
            .slice()
            .sort((first, second) => Number(second.risk_score) - Number(first.risk_score))
            .forEach(wallet => table.appendChild(createWalletRow(wallet)));
    } catch (error) {
        console.error("Failed to load wallet data:", error);
    }
}

function createWalletRow(wallet) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><button class="wallet-button" type="button">${wallet.wallet}</button></td>
        <td>${wallet.total_transactions}</td>
        <td>${Number(wallet.total_incoming).toFixed(2)}</td>
        <td>${Number(wallet.total_outgoing).toFixed(2)}</td>
        <td>${wallet.unique_connections}</td>
        <td><strong>${Number(wallet.risk_score).toFixed(2)}</strong></td>
        <td><span class="badge ${riskBadgeClass(wallet.risk_level)}">${wallet.risk_level}</span></td>
    `;
    row.querySelector(".wallet-button").addEventListener("click", () => showWalletDetails(wallet.wallet));
    return row;
}
