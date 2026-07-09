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

        const mokaDealerCode = process.env.MOKA_DEALER_CODE || "1731";
        const mokaUsername = process.env.MOKA_USERNAME || "TestMoka2";
        const mokaPassword = process.env.MOKA_PASSWORD || "HYSYHDS8DU8HU";
        const isTest = process.env.MOKA_IS_TEST !== "false";

        const baseUrl = isTest ? "https://service.refmokaunited.com" : "https://service.mokaunited.com";

        const checkKeyRaw = mokaDealerCode + "MK" + mokaUsername + "PD" + mokaPassword;
        const checkKey = crypto.createHash("sha256").update(checkKeyRaw).digest("hex");

        const targetInstallments = [1, 2, 3, 6, 9, 12];
        const amount = Number(totalPrice) || 100;

        const promises = targetInstallments.map(async (inst) => {
            try {
                const payload = {
                    PaymentDealerAuthentication: {
                        DealerCode: mokaDealerCode,
                        Username: mokaUsername,
                        Password: mokaPassword,
                        CheckKey: checkKey
                    },
                    PaymentDealerRequest: {
                        BinNumber: binCode.substring(0, 6),
                        Currency: "TL",
                        OrderAmount: amount,
                        InstallmentNumber: inst,
                        IsThreeD: 1
                    }
                };

                const res = await axios.post(`${baseUrl}/PaymentDealer/DoCalcPaymentAmount`, payload);
                if (res.data && res.data.ResultCode === "Success" && res.data.Data) {
                    const data = res.data.Data;
                    const paymentAmount = Number(data.PaymentAmount) || amount;
                    return {
                        InstallmentNumber: inst,
                        Amount: Math.round((paymentAmount / inst) * 100) / 100,
                        TotalPrice: Math.round(paymentAmount * 100) / 100,
                        CommissionRate: Number(data.DealerCommissionRate) || 0
                    };
                } else {
                    console.log(`[MOKA CALC FAILED] Inst ${inst}:`, res.data);
                    return null;
                }
            } catch (err: any) {
                console.log(`[MOKA CALC ERROR] Inst ${inst}:`, err.message);
                return null;
            }
        });

        const results = await Promise.all(promises);
        const validInstallments = results.filter(r => r !== null);

        if (validInstallments.length === 0) {
            validInstallments.push({
                InstallmentNumber: 1,
                Amount: amount,
                TotalPrice: amount,
                CommissionRate: 0
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                InstallmentHeaderList: [
                    {
                        CardBrandName: "Moka",
                        InstallmentDetailList: validInstallments
                    }
                ]
            }
        });

    } catch (err: any) {
        console.error("Moka Installment Calculation Loop Error:", err);
        return NextResponse.json({ error: err.message || "Taksit sorgulanamadı." }, { status: 500 });
    }
}
