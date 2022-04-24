import { VK } from 'vk-io'
import dotenv from 'dotenv'
import { newOrderMessage, sendBotMessage, getCartItemsStr } from './utils.js'

dotenv.config()

const token = process.env.VK_BOT_ACCESS_TOKEN
const chat_id = process.env.TELEGRAM_KG_CHAT_ID
const vk = new VK({token})

const getLastOrder = async () => {
  const data = await vk.api.market.getGroupOrders({
    group_id: 118017840,
    count: 1
  })

  return data.items[0]
}

vk.updates.on('market_order_new', async () => {
  const {
    display_order_id: orderId,
    recipient: { name, phone },
    delivery: { address },
    total_price: { text: total },
    preview_order_items: items,
    payment: { status: paymentStatus },
    comment
  } = await getLastOrder()

  const orderDetails = getCartItemsStr(items)

  const message = newOrderMessage({
    orderId,
    name,
    phone,
    address,
    total,
    orderDetails,
    paymentStatus,
    comment
  })

  const tgRes = await sendBotMessage(chat_id, message)
})

vk.updates.start().catch(console.error)