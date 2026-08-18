
import Stripe from "stripe"
import config from "../../config"
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"


const createCheckoutSession = async (userId: string) => {
    const transactionResult = await prisma.$transaction(async (tx) => {

        const user = await tx.user.findUniqueOrThrow({
            where: {
                id: userId
            },
            include: {
                subscription: true
            }
        })

        // old subscriber
        let stripeCustomerId = user.subscription?.stripeCustomerId



        if (!stripeCustomerId) {
            // new subscriber
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: { userId: user.id }
            })
            stripeCustomerId = customer.id
        }


        const session = await stripe.checkout.sessions.create({
            line_items : [{
                price : config.stripe_price_id,
                quantity : 1
            }],
            mode : "subscription",
            customer : stripeCustomerId,
            payment_method_types : ["card"],
            success_url : `${config.app_url}/premium?success=true`,
            cancel_url : `${config.app_url}/payment?success=false`,
            metadata : {userId : user.id}
        })

        // console.log(session)

        return session.url
    })
    return{
        paymentUrl : transactionResult
    }
}

const handleWebhook = async(payload:Buffer, signature:string) =>{
    const endpointSecret = config.stripe_webhook_secret
    console.log("Inside webhook ",endpointSecret,payload)
    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret
    )



    // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
        const session : Stripe.Checkout.Session = event.data.object;

        const userId = session.metadata?.userId

        const stripeCustomerId = session.customer

        const stripeSubscriptionId = session.subscription as string;

        if(!userId || !stripeSubscriptionId || !stripeCustomerId){
            throw new Error("Webhook failed!")
        }

        const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

        console.log(stripeSubscription.items.data[0])
       

      break;
    case 'customer.subscription.updated':
      const paymentMethod = event.data.object;
      
      break;
    
    case 'customer.subscription.deleted':
        // const paymentObject

        break
    // ... handle other event types
    default:
      console.log("No event matched", `Unhandled event type ${event.type}`);
        break
  }
}

export const subscriptionService = {
    createCheckoutSession,
    handleWebhook
}