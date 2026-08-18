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

// ==========================================
// Load Transaction Graph
// ==========================================

async function loadTransactionGraph() {

    try {

        // ======================================
        // Get transactions
        // ======================================

        const transactionResponse =
            await fetch(
                `${API_URL}/api/transactions`
            );


        if (!transactionResponse.ok) {

            throw new Error(
                "Failed to fetch transactions"
            );

        }


        const transactionData =
            await transactionResponse.json();


        // ======================================
        // Get wallet risk information
        // ======================================

        const walletResponse =
            await fetch(
                `${API_URL}/api/wallets`
            );


        if (!walletResponse.ok) {

            throw new Error(
                "Failed to fetch wallets"
            );

        }


        const walletData =
            await walletResponse.json();


        const wallets =
            walletData.wallets;


        // ======================================
        // Create wallet lookup
        // ======================================

        const walletMap =
            new Map();


        wallets.forEach(wallet => {

            walletMap.set(
                wallet.wallet,
                wallet
            );

        });


        // ======================================
        // Create Graph Nodes
        // ======================================

        const nodes = [];


        walletMap.forEach(wallet => {

            let nodeColor =
                "#22c55e";


            if (
                wallet.risk_level === "HIGH"
            ) {

                nodeColor =
                    "#ef4444";

            }

            else if (
                wallet.risk_level === "MEDIUM"
            ) {

                nodeColor =
                    "#f59e0b";

            }


            nodes.push({

                id: wallet.wallet,

                label: wallet.wallet,

                title:
                    `Wallet: ${wallet.wallet}
Risk Score: ${wallet.risk_score}
Risk Level: ${wallet.risk_level}
Transactions: ${wallet.total_transactions}`,

                color: {

                    background: nodeColor,

                    border: nodeColor,

                    highlight: {

                        background: "#ffffff",

                        border: nodeColor

                    }

                },

                font: {

                    color: "#ffffff",

                    size: 14,

                    face: "Arial"

                },

                size: 25

            });

        });


        // ======================================
        // Create Graph Edges
        // ======================================

        const edges = [];


        transactionData.transactions.forEach(
            (transaction, index) => {

                const amount =
                    Number(
                        transaction.amount
                    );


                edges.push({

                    id: index,

                    from:
                        transaction.sender,

                    to:
                        transaction.receiver,

                    label:
                        amount.toFixed(0),

                    arrows: "to",

                    width:
                        Math.max(
                            1,
                            Math.min(
                                6,
                                amount / 3000
                            )
                        ),

                    color: {

                        color: "#475569",

                        highlight: "#60a5fa"

                    },

                    font: {

                        color: "#94a3b8",

                        size: 10,

                        strokeWidth: 0

                    },

                    smooth: {

                        type: "curvedCW",

                        roundness: 0.15

                    }

                });

            }
        );


        // ======================================
        // Graph Container
        // ======================================

        const container =
            document.getElementById(
                "transaction-graph"
            );


        // ======================================
        // Graph Data
        // ======================================

        const data = {

            nodes:
                new vis.DataSet(nodes),

            edges:
                new vis.DataSet(edges)

        };


        // ======================================
        // Graph Configuration
        // ======================================

        const options = {

            autoResize: true,

            physics: {

                enabled: true,

                stabilization: {

                    iterations: 200

                },

                barnesHut: {

                    gravitationalConstant: -3000,

                    centralGravity: 0.2,

                    springLength: 180,

                    springConstant: 0.04,

                    damping: 0.09

                }

            },


            interaction: {

                hover: true,

                zoomView: true,

                dragView: true,

                navigationButtons: true,

                keyboard: true

            },


            nodes: {

                shape: "dot",

                borderWidth: 2,

                shadow: {

                    enabled: true,

                    size: 10,

                    x: 0,

                    y: 2

                }

            },


            edges: {

                selectionWidth: 2,

                hoverWidth: 2

            }


        };


        // ======================================
        // Create Network
        // ======================================

        const network =
            new vis.Network(
                container,
                data,
                options
            );


        // ======================================
        // Click Wallet Node
        // ======================================

        network.on(
            "click",
            function(params) {

                if (
                    params.nodes.length === 0
                ) {

                    return;

                }


                const walletId =
                    params.nodes[0];


                showWalletDetails(
                    walletId
                );

            }
        );


    }

    catch (error) {

        console.error(
            "Failed to load transaction graph:",
            error
        );

    }

}

loadWallets();
loadTransactionGraph();


