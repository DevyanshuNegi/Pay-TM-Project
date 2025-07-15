"use server";

import prisma from "@repo/db/client";


export async function addOnRamp(amount: string, provider: string, email: string)
// : Promise<{ success: boolean, message?: string, response?: string }> 
{

    // This function would typically handle the logic to add money to the user's account.
    // For now, we will just simulate a successful transaction.

    // // find unique user with email:email or phone:email
    if (!email) {
        return { success: false, response: "Email is required" };
    }
    if (!amount || !provider) {
        return { success: false, response: "Amount and provider are required" };
    }
    console.log("processing on ramp transaction for ", email, amount, provider);
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: email },
                { number: email }
            ]
        }
    });
    console.log("USER FOUND: ", user);

    // const user = await prisma.user.findUnique({where:{email:email}});
    // TODO: fix this
    const userId: number = user?.id || 3;

    console.log("THIS IS USER ", user, userId);

    console.log("adding on ramp transaction");

    const response = await prisma.onRampTransaction.create({
        data: {
            status: "Processing",
            amount: parseInt(amount, 10),
            provider: provider,
            startTime: new Date(),
            userId: userId,
            token: Math.floor(Math.random() * 1000000).toString() // generate a random token
            // NOTE: in real world, you would use a more secure method to generate a token
            // and also handle the payment gateway integration here.
            // This is just a simulation.
            // bank would send the token
        }
    })

    console.log(response);

    return {
        success: true,
        message: `Successfully added Rs ${amount} using ${provider}.`
    };
}