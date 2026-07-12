const axios = require("axios");

const paths = [
    "WebPos/GetInstallmentInformation",
    "WebPos/GetInstallmentInfo",
    "WebPos/GetInstallments",
    "WebPos/GetInstallmentList",
    "WebPos/GetInstallmentRates",
    "WebPos/GetDealerInstallmentRates",
    "WebPos/GetBankCardInformation",
    "Payment/GetInstallmentInformation",
    "Payment/GetInstallmentInfo",
    "Payment/GetInstallments",
    "Payment/GetInstallmentList",
    "Payment/GetInstallmentRates",
    "PaymentDealer/GetInstallmentInformation",
    "PaymentDealer/GetInstallmentInfo",
    "PaymentDealer/GetInstallments",
    "PaymentDealer/GetInstallmentList",
    "PaymentDealer/GetInstallmentRates",
    "WebPos/CreateWebPosRequest",
    "WebPos/GetBankCardInformation"
];

async function run() {
    for (const path of paths) {
        const url = `https://clientwebpos.mokaunited.com/Api/${path}`;
        try {
            const res = await axios.post(url, {});
            console.log(`Path: ${path} -> SUCCESS: Status ${res.status}`);
        } catch (err) {
            if (err.response) {
                console.log(`Path: ${path} -> FAILED: Status ${err.response.status}`);
            } else {
                console.log(`Path: ${path} -> ERROR: ${err.message}`);
            }
        }
    }
}

run();
