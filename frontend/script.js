const API_URL = "http://localhost:5000";


// ==========================================
// Load wallet data
// ==========================================

async function loadWallets() {

    try {

        const response = await fetch(
            `${API_URL}/api/wallets`
        );

        const data = await response.json();

        const wallets = data.wallets;


        // -----------------------------
        // Calculate statistics
        // -----------------------------

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


        // -----------------------------
        // Update statistics
        // -----------------------------

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


        // -----------------------------
        // Populate table
        // -----------------------------

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
                    wallet.risk_level ===
                    "HIGH"
                ) {

                    badgeClass =
                        "badge-high";

                }

                else if (
                    wallet.risk_level ===
                    "MEDIUM"
                ) {

                    badgeClass =
                        "badge-medium";

                }


                row.innerHTML = `

                    <td>
                        <strong>
                            ${wallet.wallet}
                        </strong>
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
// Start application
// ==========================================

loadWallets();