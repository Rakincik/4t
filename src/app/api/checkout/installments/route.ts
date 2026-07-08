import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import axios from "axios";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const token = await getToken({ req });
        if (!token) {
            return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
        }

        const body = await req.json();
        const { binCode, totalPrice } = body;

        if (!binCode || binCode.length < 6) {
            return NextResponse.json({ error: "Geçersiz BIN kodu." }, { status: 400 });
        }

        const totalAmount = parseFloat(totalPrice) || 0;
        if (totalAmount <= 0) {
            return NextResponse.json({ error: "Geçersiz tutar." }, { status: 400 });
        }

        // Credentials
        const mokaDealerCode = process.env.MOKA_DEALER_CODE || "1731";
        const mokaUsername = process.env.MOKA_USERNAME || "TestMoka2";
        const mokaPassword = process.env.MOKA_PASSWORD || "HYSYHDS8DU8HU";
        const isTest = process.env.MOKA_IS_TEST !== "false";

        const baseUrl = isTest ? "https://clientwebpos.refmokaunited.com/Api" : "https://clientwebpos.mokaunited.com/Api";

        const checkKeyRaw = mokaDealerCode + "MK" + mokaUsername + "PD" + mokaPassword;
        const checkKey = crypto.createHash("sha256").update(checkKeyRaw).digest("hex");

        const payload = {
            PaymentDealerAuthentication: {
                DealerCode: mokaDealerCode,
                Username: mokaUsername,
                Password: mokaPassword,
                CheckKey: checkKey
            },
            GetInstallmentInformationRequest: {
                BinCode: binCode.substring(0, 6),
                TotalPrice: totalAmount,
                IsIncludedCommissionAmount: 0
            }
        };

        const response = await axios.post(`${baseUrl}/WebPos/GetInstallmentInformation`, payload);

        if (response.data && response.data.ResultCode === "Success") {
            return NextResponse.json({ 
                success: true, 
                data: response.data.Data 
            });
        } else {
            return NextResponse.json({ 
                success: false, 
                error: response.data?.ResultMessage || "Moka taksit bilgisi alınamadı." 
            }, { status: 400 });
        }

    } catch (error: any) {
        console.error("Moka Installment API Error:", error);
        return NextResponse.json({ 
            error: "Taksit sorgulama sırasında sistemsel bir hata oluştu.",
            details: error?.message || String(error)
        }, { status: 500 });
    }
}
