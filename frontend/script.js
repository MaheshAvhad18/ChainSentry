Promise.all([
	import("./js/wallets.js"),
	import("./js/suspicious.js"),
	import("./js/graph.js"),
	import("./js/modal.js")
]).then(([wallets, suspicious, graph, modal]) => {
	modal.setupModal();
	wallets.loadWallets();
	suspicious.loadSuspiciousWallets();
	graph.loadTransactionGraph();
}).catch(error => {
	console.error("Failed to initialize ChainSentry frontend:", error);
});
