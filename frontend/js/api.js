const API_URL = "http://127.0.0.1:5000";

async function request(path) {
    const response = await fetch(`${API_URL}${path}`);

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${path}`);
    }

    return response.json();
}

export function getWallets() {
    return request("/api/wallets");
}

export function getWalletInvestigation(walletId) {
    return request(`/api/wallet/${encodeURIComponent(walletId)}/investigation`);
}

export function getTransactions() {
    return request("/api/transactions");
}

export function getGraphAnalysis() {
    return request("/api/graph-analysis");
}
