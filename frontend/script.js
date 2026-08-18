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

// ==========================================
// Load Transaction Graph
// ==========================================

    async function loadTransactionGraph() {

        try {

            // ======================================
            // Fetch Transactions
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
            // Fetch Wallet Risk Data
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
            // Wallet Lookup
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
            // Create Nodes
            // ======================================

            const nodes = [];


            walletMap.forEach(wallet => {

                let nodeColor = "#22c55e";


                if (
                    wallet.risk_level === "HIGH"
                ) {

                    nodeColor = "#ef4444";

                }

                else if (
                    wallet.risk_level === "MEDIUM"
                ) {

                    nodeColor = "#f59e0b";

                }


                // Increase size for high-risk wallets

                let nodeSize = 22;


                if (
                    wallet.risk_level === "HIGH"
                ) {

                    nodeSize = 32;

                }

                else if (
                    wallet.risk_level === "MEDIUM"
                ) {

                    nodeSize = 27;

                }


                nodes.push({

                    id: wallet.wallet,

                    label: wallet.wallet,

                    title:
                        `<b>${wallet.wallet}</b><br>
                        Risk Score: ${wallet.risk_score}<br>
                        Risk Level: ${wallet.risk_level}<br>
                        Transactions: ${wallet.total_transactions}<br>
                        Connections: ${wallet.unique_connections}`,

                    size: nodeSize,

                    color: {

                        background: nodeColor,

                        border: "#e2e8f0",

                        highlight: {

                            background: "#ffffff",

                            border: nodeColor

                        }

                    },

                    borderWidth: 2,

                    font: {

                        color: "#ffffff",

                        size: 14,

                        face: "Arial",

                        bold: true

                    },

                    shadow: {

                        enabled: true,

                        color: nodeColor,

                        size: 12,

                        x: 0,

                        y: 0

                    }

                });

            });


            // ======================================
            // Create Edges
            // ======================================

            const edges = [];


            transactionData.transactions.forEach(
                (transaction, index) => {

                    const amount =
                        Number(
                            transaction.amount
                        );


                    /*
                    * Large transactions are treated
                    * as potentially suspicious.
                    */

                    const isLargeTransaction =
                        amount >= 10000;


                    let edgeColor =
                        "#475569";


                    let edgeWidth =
                        Math.max(
                            1,
                            Math.min(
                                5,
                                amount / 3000
                            )
                        );


                    if (
                        isLargeTransaction
                    ) {

                        edgeColor =
                            "#ef4444";

                        edgeWidth =
                            Math.max(
                                3,
                                Math.min(
                                    8,
                                    amount / 2500
                                )
                            );

                    }


                    edges.push({

                        id: index,

                        from:
                            transaction.sender,

                        to:
                            transaction.receiver,

                        label:
                            amount >= 1000
                                ? `${(amount / 1000).toFixed(1)}K`
                                : amount.toFixed(0),

                        arrows: {

                            to: {

                                enabled: true,

                                scaleFactor: 0.7

                            }

                        },

                        width: edgeWidth,

                        color: {

                            color: edgeColor,

                            highlight: "#60a5fa",

                            hover: "#93c5fd"

                        },

                        title:
                            `<b>Transaction</b><br>
                            ${transaction.sender}
                            → 
                            ${transaction.receiver}<br>
                            Amount: ${amount.toFixed(2)}<br>
                            Time: ${transaction.timestamp}`,

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
            // Graph Options
            // ======================================

            const options = {

                autoResize: true,

                physics: {

                    enabled: true,

                    stabilization: {

                        enabled: true,

                        iterations: 250

                    },

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


                nodes: {

                    shape: "dot",

                    scaling: {

                        min: 18,

                        max: 40

                    }

                },


                edges: {

                    selectionWidth: 3,

                    hoverWidth: 2,

                    smooth: {

                        enabled: true

                    }

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
            // Click Wallet
            // ======================================

            network.on(
                "click",
                function(params) {

                    // Nothing selected

                    if (
                        params.nodes.length === 0 &&
                        params.edges.length === 0
                    ) {

                        return;

                    }


                    // Wallet clicked

                    if (
                        params.nodes.length > 0
                    ) {

                        const walletId =
                            params.nodes[0];


                        showWalletDetails(
                            walletId
                        );

                        return;

                    }


                    // Transaction clicked

                    if (
                        params.edges.length > 0
                    ) {

                        const edgeId =
                            params.edges[0];


                        const transaction =
                            transactionData
                                .transactions[
                                    edgeId
                                ];


                        if (transaction) {

                            alert(
                                `Transaction\n\n` +
                                `${transaction.sender} → ` +
                                `${transaction.receiver}\n` +
                                `Amount: ${transaction.amount}\n` +
                                `Time: ${transaction.timestamp}`
                            );

                        }

                    }

                }
            );


            // ======================================
            // Double Click: Reset View
            // ======================================

            network.on(
                "doubleClick",
                function() {

                    network.fit({

                        animation: {

                            duration: 800,

                            easingFunction:
                                "easeInOutQuad"

                        }

                    });

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



    // ==========================================
// Load Suspicious Wallets
// ==========================================

async function loadSuspiciousWallets() {

    try {

        const response =
            await fetch(
                `${API_URL}/api/suspicious-wallets`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to fetch suspicious wallets"
            );

        }


        const data =
            await response.json();


        const wallets =
            data.wallets;


        // ======================================
        // Update Count
        // ======================================

        document.getElementById(
            "suspicious-count"
        ).textContent =
            `${wallets.length} detected`;


        const table =
            document.getElementById(
                "suspicious-table"
            );


        table.innerHTML = "";


        // ======================================
        // Empty State
        // ======================================

        if (
            wallets.length === 0
        ) {

            table.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        class="no-suspicious-wallets"
                    >

                        ✓ No suspicious wallets detected

                    </td>

                </tr>

            `;

            return;

        }


        // ======================================
        // Create Rows
        // ======================================

        wallets.forEach(wallet => {

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


            // ----------------------------------
            // Detection signals
            // ----------------------------------

            const signals =
                wallet.suspicion_reasons
                    .map(reason => {

                        return `

                            <span class="signal">
                                • ${reason}
                            </span>

                        `;

                    })
                    .join("");


            row.innerHTML = `

                <td>

                    <button
                        class="suspicious-wallet-button"
                        type="button"
                    >

                        ${wallet.wallet}

                    </button>

                </td>


                <td>

                    <span
                        class="suspicious-score"
                    >

                        ${Number(
                            wallet.risk_score
                        ).toFixed(2)}

                    </span>

                </td>


                <td>

                    <span
                        class="badge ${badgeClass}"
                    >

                        ${wallet.risk_level}

                    </span>

                </td>


                <td>

                    ${Number(
                        wallet.total_volume
                    ).toLocaleString(
                        undefined,
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    )}

                </td>


                <td>

                    ${wallet.large_transactions}

                </td>


                <td>

                    ${wallet.connections}

                </td>


                <td>

                    <div
                        class="signal-list"
                    >

                        ${signals}

                    </div>

                </td>

            `;


            // ==================================
            // Wallet Click
            // ==================================

            row.querySelector(
                ".suspicious-wallet-button"
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
            "Failed to load suspicious wallets:",
            error
        );

    }

}


loadWallets();
loadSuspiciousWallets();
loadTransactionGraph();


