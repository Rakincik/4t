const crypto = require('crypto');
const axios = require('axios');
require('dotenv').config();

async function testMokaAuth() {
    const dealerCode = process.env.MOKA_DEALER_CODE || "1731";
    const username = process.env.MOKA_USERNAME || "TestMoka2";
    const password = process.env.MOKA_PASSWORD || "HYSYHDS8DU8HU";
    const isTest = process.env.MOKA_IS_TEST !== "false";

    console.log("=== Moka Authentication Verification ===");
    console.log("Dealer Code:", dealerCode);
    console.log("Username:", username);
    console.log("Is Test Environment:", isTest);

    const baseUrl = isTest ? "https://service.refmokaunited.com" : "https://service.mokaunited.com";
    
    // Calculate CheckKey: SHA256(DealerCode + "MK" + Username + "PD" + Password)
    const rawKey = dealerCode + "MK" + username + "PD" + password;
    const checkKey = crypto.createHash('sha256').update(rawKey).digest('hex');

    console.log("Generated CheckKey:", checkKey);

    // Call GetBankCardInformation (BIN query) using a test bin (526911 for Finansbank)
    const payload = {
        PaymentDealerAuthentication: {
            DealerCode: dealerCode,
            Username: username,
            Password: password,
            CheckKey: checkKey
        },
        BankCardInformationRequest: {
            BinNumber: "526911"
        }
    };

    try {
        console.log("Calling Moka API /PaymentDealer/GetBankCardInformation...");
        const response = await axios.post(`${baseUrl}/PaymentDealer/GetBankCardInformation`, payload);
        
        console.log("\n=== Response ===");
        console.log("ResultCode:", response.data.ResultCode);
        console.log("ResultMessage:", response.data.ResultMessage);
        console.log("Exception:", response.data.Exception);
        console.log("Data:", JSON.stringify(response.data.Data, null, 2));

        if (response.data.ResultCode === "Success" && response.data.Data) {
            console.log("\n[SUCCESS] Moka credentials are valid and connection is successful!");
        } else {
            console.log("\n[FAIL] Moka API returned an error code. Check your credentials.");
        }
    } catch (error) {
        console.error("\n[ERROR] Connection failed:", error.message);
        if (error.response) {
            console.error("HTTP Status Code:", error.response.status);
            console.error("HTTP Response Data:", JSON.stringify(error.response.data, null, 2));
        }
    }
}

testMokaAuth();
