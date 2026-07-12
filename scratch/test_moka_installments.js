const axios = require("axios");
const crypto = require("crypto");

const dealerCode = "198724";
const username = "170885bb-9954-40f5-be53-b21517832fb2";
const password = "3f93efa4-3c52-4991-93ef-cb73cba5f79f";

const checkKeyRaw = dealerCode + "MK" + username + "PD" + password;
const checkKey = crypto.createHash("sha256").update(checkKeyRaw).digest("hex");

const endpoints = [
    {
        name: "1. WebPos/GetInstallmentInformation (clientwebpos)",
        url: "https://clientwebpos.mokaunited.com/Api/WebPos/GetInstallmentInformation",
        payload: {
            PaymentDealerAuthentication: { DealerCode: dealerCode, Username: username, Password: password, CheckKey: checkKey },
            GetInstallmentInformationRequest: { BinCode: "553056", TotalPrice: 100, IsIncludedCommissionAmount: 0 }
        }
    },
    {
        name: "2. PaymentDealer/GetInstallmentInformation (service)",
        url: "https://service.mokaunited.com/PaymentDealer/GetInstallmentInformation",
        payload: {
            PaymentDealerAuthentication: { DealerCode: dealerCode, Username: username, Password: password, CheckKey: checkKey },
            GetInstallmentInformationRequest: { BinCode: "553056", TotalPrice: 100, IsIncludedCommissionAmount: 0 }
        }
    },
    {
        name: "3. PaymentDealer/DoCalcPaymentAmount (service)",
        url: "https://service.mokaunited.com/PaymentDealer/DoCalcPaymentAmount",
        payload: {
            PaymentDealerAuthentication: { DealerCode: dealerCode, Username: username, Password: password, CheckKey: checkKey },
            PaymentDealerRequest: { BinNumber: "553056", OrderAmount: 100, InstallmentNumber: 3, IsThreeD: 1 }
        }
    },
    {
        name: "4. WebPos/GetInstallmentList (clientwebpos)",
        url: "https://clientwebpos.mokaunited.com/Api/WebPos/GetInstallmentList",
        payload: {
            PaymentDealerAuthentication: { DealerCode: dealerCode, Username: username, Password: password, CheckKey: checkKey },
            GetInstallmentInformationRequest: { BinCode: "553056", TotalPrice: 100 }
        }
    }
];

async function run() {
    for (const ep of endpoints) {
        console.log(`\nTesting ${ep.name}...`);
        try {
            const res = await axios.post(ep.url, ep.payload);
            console.log(`Status: ${res.status}`);
            console.log("Response:", JSON.stringify(res.data, null, 2));
        } catch (err) {
            if (err.response) {
                console.log(`Failed with status ${err.response.status}`);
                console.log("Error body:", JSON.stringify(err.response.data, null, 2));
            } else {
                console.log("Error:", err.message);
            }
        }
    }
}

run();
