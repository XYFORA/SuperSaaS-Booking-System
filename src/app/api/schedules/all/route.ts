import { NextResponse } from "next/server";

export const revalidate = 5;

export async function GET() {

    const accountName = process.env.SUPER_SAAS_ACCOUNT_NAME;

    const apiKey = process.env.SUPER_SAAS_API_KEY;

    if (!accountName || !apiKey) {

        return NextResponse.json(
            { error: "Missing SuperSaaS credentials" },
            { status: 500 }
        );

    }

    const baseUrl = "https://www.supersaas.nl/api";

    const auth = "Basic " + Buffer.from(`${accountName}:${apiKey}`).toString("base64");

    try {

        const schedulesRes = await fetch(`${baseUrl}/schedules.json`, {
            headers: { Authorization: auth },
            next: { revalidate: 5 },
        });

        const schedules = await schedulesRes.json();

        const fullData = await Promise.all(

            schedules.map(async (schedule: any) => {

                const [bookingsRes, resourcesRes] = await Promise.all([
                    fetch(`${baseUrl}/bookings.json?schedule_id=${schedule.id}`,
                        {
                            headers: { Authorization: auth },
                            next: { revalidate: 5 }
                        }
                    ),
                    fetch(`${baseUrl}/resources.json?schedule_id=${schedule.id}`,
                        {
                            headers: { Authorization: auth },
                            next: { revalidate: 5 }
                        }
                    )
                ]);

                const bookings = bookingsRes.ok ? await bookingsRes.json() : [];

                const resources = resourcesRes.ok ? await resourcesRes.json() : [];

                return {
                    schedule_id: schedule.id,
                    schedule_name: schedule.name,
                    bookings,
                    resources,
                    stats: {
                        total_bookings: bookings.length,
                        total_resources: resources.length,
                    }

                };

            })

        );

        const totalBookings = fullData.reduce((sum, s) => sum + s.stats.total_bookings, 0);

        return NextResponse.json({
            success: true,
            generated_at: new Date().toISOString(),
            stats: {
                total_schedules: fullData.length,
                total_bookings: totalBookings
            },
            data: fullData
        });

    } catch (error: any) {

        console.error("SuperSaaS ALL API Error:", error);

        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );

    }

};