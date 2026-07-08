const crypto = require('crypto');
const axios = require('axios');
require('dotenv').config();

async function testPayment() {
    const dealerCode = process.env.MOKA_DEALER_CODE || "1731";
    const username = process.env.MOKA_USERNAME || "TestMoka2";
    const password = process.env.MOKA_PASSWORD || "HYSYHDS8DU8HU";
    const isTest = process.env.MOKA_IS_TEST !== "false";

    console.log("=== Moka Direct Payment Test ===");
    const baseUrl = isTest ? "https://service.refmokaunited.com" : "https://service.mokaunited.com";
    
    const rawKey = dealerCode + "MK" + username + "PD" + password;
    const checkKey = crypto.createHash('sha256').update(rawKey).digest('hex');

    const mokaPayload = {
        PaymentDealerAuthentication: {
            DealerCode: dealerCode,
            Username: username,
            Password: password,
            CheckKey: checkKey
        },
        PaymentDealerRequest: {
            CardHolderFullName: "Moka Test",
            CardNumber: "5269111122223332", // Finansbank Test
            ExpMonth: "12",
            ExpYear: "2030",
            CvcNumber: "000",
            CardToken: "",
            Amount: 5500,
            Currency: "TL",
            InstallmentNumber: 1,
            ClientIP: "127.0.0.1",
            OtherTrxCode: "TEST-" + Date.now(),
            IsPoolPayment: 0,
            IsPreAuth: 0,
            IsTokenized: 0,
            Software: "4T Akademi",
            Description: "Test Payment",
            ReturnHash: 1,
            RedirectUrl: "http://localhost:3000/api/checkout/moka-callback",
            RedirectType: 0,
            BuyerInformation: {
                BuyerFullName: "Müşteri Test",
                BuyerGsmNumber: "5555552241",
                BuyerEmail: "test@mail.com",
                BuyerAddress: "Test Address"
            }
        }
    };

    try {
        const response = await axios.post(`${baseUrl}/PaymentDealer/DoDirectPaymentThreeD`, mokaPayload);
        console.log("ResultCode:", response.data.ResultCode);
        console.log("ResultMessage:", response.data.ResultMessage);
        if (response.data.Data) {
            console.log("Data.Url:", response.data.Data.Url);
            console.log("Data.CodeForHash:", response.data.Data.CodeForHash);
        }
    } catch (error) {
        console.error("Request Error:", error.message);
    }
}

testPayment();
