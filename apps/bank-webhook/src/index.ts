import express from "express";
import db from "@repo/db/client";
const app = express();

app.use(express.json())
// app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data

app.post("/hdfcWebhook", async (req, res) => {
    //TODO: Add zod validation here?
    //TODO: HDFC bank should ideally send us a secret so we know this is sent by them
    const paymentInformation: {
        token: string;
        userId: string;
    } = {
        token: req.body.token,
        userId: req.body.user_identifier
    };

    console.log("Token: ", paymentInformation.token);
    let user = await db.onRampTransaction.findFirst({
        where: {
            token: paymentInformation.token}
    })
    let amount = ((user?.amount) || 0)*100;
    
    console.log("final amount ", amount);
    try {
        console.log("Processing webhook for user: ", paymentInformation.userId);
        await db.$transaction([
            db.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        // You can also get this from your DB
                        increment: Number(amount)
                    }
                }
            }),
            db.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                }, 
                data: {
                    status: "Success",
                }
            })
        ]);

        res.json({
            message: "Captured"
        })
    } catch(e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }

})

app.listen(3003);