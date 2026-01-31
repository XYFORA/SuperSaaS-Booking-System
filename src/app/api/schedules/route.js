import { NextResponse } from "next/server";

export const revalidate = 5;

export async function GET() {

    const accountName = process.env.SUPER_SAAS_ACCOUNT_NAME;

    const apiKey = process.env.SUPER_SAAS_API_KEY;

    const baseUrl = "https://www.supersaas.nl/api";

    const auth = "Basic " + Buffer.from(`${accountName}:${apiKey}`).toString("base64");

    const schedulesRes = await fetch(`${baseUrl}/schedules.json`, {
        headers: { Authorization: auth },
        next: { revalidate: 5 }
    });

    const schedules = await schedulesRes.json();

    const data = await Promise.all(

        schedules.map(async (schedule) => {

            const bookingsRes = await fetch(`${baseUrl}/bookings.json?schedule_id=${schedule.id}`,
                {
                    headers: { Authorization: auth },
                    next: { revalidate: 5 }
                }
            );

            const bookings = bookingsRes.ok
                ? await bookingsRes.json()
                : [];

            return { ...schedule, bookings };

        })

    );

    return NextResponse.json(data);

};