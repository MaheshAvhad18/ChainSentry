const API_URL = "http://localhost:5000";


// ==========================================
// Load Wallets
// ==========================================

async function loadWallets() {

    try {

        const response = await fetch(
            `${API_URL}/api/wallets`
        );

        const data = await response.json();

        const wallets = data.wallets;


        // ======================================
        // Calculate Statistics
        // ======================================

        const highRisk = wallets.filter(
            wallet =>
                wallet.risk_level === "HIGH"
        ).length;


        const mediumRisk = wallets.filter(
            wallet =>
                wallet.risk_level === "MEDIUM"
        ).length;


        const lowRisk = wallets.filter(
            wallet =>
                wallet.risk_level === "LOW"
        ).length;


        document.getElementById(
            "total-wallets"
        ).textContent = wallets.length;


        document.getElementById(
            "high-risk"
        ).textContent = highRisk;


        document.getElementById(
            "medium-risk"
        ).textContent = mediumRisk;


        document.getElementById(
            "low-risk"
        ).textContent = lowRisk;


        // ======================================
        // Wallet Table
        // ======================================

        const table =
            document.getElementById(
                "wallet-table"
            );


        table.innerHTML = "";


        wallets
            .sort(
                (a, b) =>
                    Number(b.risk_score) -
                    Number(a.risk_score)
            )
            .forEach(wallet => {

                const row =
                    document.createElement("tr");


                let badgeClass =
                    "badge-low";


                if (
                    wallet.risk_level === "HIGH"
                ) {

                    badgeClass =
                        "badge-high";

                }

                else if (
                    wallet.risk_level === "MEDIUM"
                ) {

                    badgeClass =
                        "badge-medium";

                }


                row.innerHTML = `

                    <td>

                        <button
                            class="wallet-button"
                            type="button"
                        >

                            ${wallet.wallet}

                        </button>

                    </td>

                    <td>
                        ${wallet.total_transactions}
                    </td>

                    <td>
                        ${Number(
                            wallet.total_incoming
                        ).toFixed(2)}
                    </td>

                    <td>
                        ${Number(
                            wallet.total_outgoing
                        ).toFixed(2)}
                    </td>

                    <td>
                        ${wallet.unique_connections}
                    </td>

                    <td>

                        <strong>
                            ${Number(
                                wallet.risk_score
                            ).toFixed(2)}
                        </strong>

                    </td>

                    <td>

                        <span
                            class="badge ${badgeClass}"
                        >

                            ${wallet.risk_level}

                        </span>

                    </td>
                `;


                // Attach click event properly
                row.querySelector(
                    ".wallet-button"
                ).addEventListener(
                    "click",
                    () => {
                        showWalletDetails(
                            wallet.wallet
                        );
                    }
                );


                table.appendChild(row);

            });

    }

    catch (error) {

        console.error(
            "Failed to load wallet data:",
            error
        );

    }

}


// ==========================================
// Show Wallet Details
// ==========================================

async function showWalletDetails(walletId) {

    try {

        const walletResponse =
            await fetch(
                `${API_URL}/api/wallet/${walletId}`
            );


        if (!walletResponse.ok) {

            throw new Error(
                "Failed to fetch wallet"
            );

        }


        const wallet =
            await walletResponse.json();


        const transactionResponse =
            await fetch(
                `${API_URL}/api/wallet/${walletId}/transactions`
            );


        if (!transactionResponse.ok) {

            throw new Error(
                "Failed to fetch transactions"
            );

        }


        const transactionData =
            await transactionResponse.json();


        // ======================================
        // Wallet Information
        // ======================================

        document.getElementById(
            "details-wallet"
        ).textContent =
            wallet.wallet;


        document.getElementById(
            "details-risk-score"
        ).textContent =
            Number(
                wallet.risk_score
            ).toFixed(2);


        document.getElementById(
            "details-risk-level"
        ).textContent =
            wallet.risk_level;


        document.getElementById(
            "details-transactions"
        ).textContent =
            wallet.total_transactions;


        document.getElementById(
            "details-connections"
        ).textContent =
            wallet.unique_connections;


        document.getElementById(
            "details-incoming"
        ).textContent =
            Number(
                wallet.total_incoming
            ).toFixed(2);


        document.getElementById(
            "details-outgoing"
        ).textContent =
            Number(
                wallet.total_outgoing
            ).toFixed(2
            );


        // ======================================
        // Risk Badge
        // ======================================

        const riskBadge =
            document.getElementById(
                "details-risk-badge"
            );


        riskBadge.textContent =
            wallet.risk_level;


        riskBadge.className =
            "badge";


        if (
            wallet.risk_level === "HIGH"
        ) {

            riskBadge.classList.add(
                "badge-high"
            );

        }

        else if (
            wallet.risk_level === "MEDIUM"
        ) {

            riskBadge.classList.add(
                "badge-medium"
            );

        }

        else {

            riskBadge.classList.add(
                "badge-low"
            );

        }


        // ======================================
        // Transaction Count
        // ======================================

        document.getElementById(
            "transaction-count"
        ).textContent =
            `${transactionData.count} transaction${
                transactionData.count === 1
                    ? ""
                    : "s"
            }`;


        // ======================================
        // Transaction Table
        // ======================================

        const transactionTable =
            document.getElementById(
                "transaction-table"
            );


        transactionTable.innerHTML = "";


        transactionData.transactions
            .forEach(transaction => {

                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${transaction.transaction_id}
                    </td>

                    <td>
                        ${transaction.sender}
                    </td>

                    <td>
                        ${transaction.receiver}
                    </td>

                    <td>
                        ${Number(
                            transaction.amount
                        ).toFixed(2)}
                    </td>

                    <td>
                        ${transaction.timestamp}
                    </td>

                `;


                transactionTable.appendChild(
                    row
                );

            });


        // ======================================
        // Open Modal
        // ======================================

        const modal =
            document.getElementById(
                "wallet-details"
            );


        modal.classList.remove(
            "hidden"
        );


        document.body.style.overflow =
            "hidden";

    }

    catch (error) {

        console.error(
            "Failed to load wallet details:",
            error
        );

    }

}


// ==========================================
// Close Modal
// ==========================================

function closeWalletDetails() {

    const modal =
        document.getElementById(
            "wallet-details"
        );


    modal.classList.add(
        "hidden"
    );


    document.body.style.overflow =
        "";

}


// ==========================================
// Close Button
// ==========================================

document
    .getElementById("close-details")
    .addEventListener(
        "click",
        closeWalletDetails
    );


// ==========================================
// Click Outside Modal
// ==========================================

document
    .getElementById("wallet-details")
    .addEventListener(
        "click",
        event => {

            if (
                event.target.id ===
                "wallet-details"
            ) {

                closeWalletDetails();

            }

        }
    );


// ==========================================
// Escape Key
// ==========================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeWalletDetails();

        }

    }
);


// ==========================================
// Start Application
// ==========================================

loadWallets();