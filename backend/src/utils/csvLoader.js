const fs = require("fs");

function loadCsv(filePath) {
    const file = fs.readFileSync(filePath, "utf-8").trim();

    if (!file) {
        return [];
    }

    const lines = file.split(/\r?\n/);
    const headers = lines[0].split(",").map(header => header.trim());

    return lines.slice(1).map(line => {
        const values = line.split(",").map(value => value.trim());

        return headers.reduce((record, header, index) => {
            record[header] = values[index];
            return record;
        }, {});
    });
}

module.exports = { loadCsv };