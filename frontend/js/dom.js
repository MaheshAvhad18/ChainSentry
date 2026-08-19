export function element(id) {
    return document.getElementById(id);
}

export function riskBadgeClass(level) {
    if (level === "HIGH") {
        return "badge-high";
    }

    if (level === "MEDIUM") {
        return "badge-medium";
    }

    return "badge-low";
}

export function formatNumber(value, digits = 2) {
    return Number(value).toFixed(digits);
}
