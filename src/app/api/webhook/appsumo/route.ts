import { db } from "@/db";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import crypto from "crypto"

export const POST = async(req: Request) => {
    try {
        const body = await req.json()
        const timestamp = req.headers['x-appsumo-timestamp'];
        const sha = req.headers['x-appsumo-signature'];
        const apiKey = process.env.APPSUMO_FAKE_API!;
        const message = `${timestamp}${body}`;
        const signature = crypto.createHmac('SHA256', apiKey).update(message).digest('hex');

        if (true) {
            const { 
                event,
                license_key,
                license_status,
                tier,
                prev_license_key,
                test,
                extra,
                } = body
                if(test){
                    return new Response(JSON.stringify({success: true, event}))
                }
                const { getUser } = getKindeServerSession()
                const user = await getUser() 
                if(!user || !user.email) return new Response(JSON.stringify({message: "No user found"}))
        
                switch (event){
                    case 'purchase':
                        // Handle purchase event
                        await db.user.upsert({
                            where: { email: user?.email },
                            update: {
                                licenseStatus: 'inactive', // Initially set to inactive
                                licenseTier: tier,
                                // Add any other necessary fields
                            },
                            create: {
                                id: user.id,
                                email: user.email,
                                licenseKey: license_key,
                                licenseStatus: 'inactive',
                                licenseTier: tier,
                                // Add any other necessary fields
                            },
                        });
                        break;
                    case 'activate':
                        // Handle activation event
                        await db.user.update({
                             where: { email: user?.email },
                            data: {
                                licenseStatus: 'active',
                            },
                        });
                        break;
                    case 'deactivate':
                        // Handle deactivation event
                        await db.user.update({
                            where: { email: user?.email },
                            data: {
                                licenseStatus: 'deactivated',
                            },
                        });
                        break;
                    case 'upgrade':
                        // Handle upgrade event
                        await db.user.update({
                            where: { email: user?.email },
                            data: {
                                licenseStatus: 'deactivated', // Deactivate the old license
                            },
                        });
                        await db.user.create({
                            data: {
                                id: user.id,
                                email: user.email, // Assuming you have the email in extra
                                licenseKey: license_key,
                                licenseStatus: 'active',
                                licenseTier: tier,
                            },
                        });
                        break;
                    case 'downgrade':
                    // Handle downgrade event
                    await db.user.update({
                        where: { email: user?.email },
                        data: {
                            licenseStatus: 'deactivated', // Deactivate the old license
                        },
                    });
                    await db.user.create({
                        data: {
                            id: user.id,
                            email: user.email,
                            licenseKey: license_key,
                            licenseStatus: 'active',
                            licenseTier: tier,
                        },
                    });
                    break;
                    default:
                        console.log('Unknown event type:', event);
                        break;
                }
                    // Send success response
          return new Response(JSON.stringify({ success: true, event }))
        } else {
            return new Response(JSON.stringify({message: 'Unauthorized'}), {status: 401});
        }

    } catch (error) {
       console.log("error occured: ", error) 
       return new Response(JSON.stringify({message: 'Error Occured'}), {status: 500});
    }
}