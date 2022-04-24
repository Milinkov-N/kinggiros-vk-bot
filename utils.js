import fetch from 'node-fetch'

export const currencyFormatter = new Intl.NumberFormat(undefined, {
  currency: 'rub',
  style: 'currency',
  currencyDisplay: 'code',
  minimumFractionDigits: 0,
}).format

export async function sendBotMessage(chat_id, text) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${ process.env.TELEGRAM_BOT_TOKEN }/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id,
        text
      })
    })

    const data = await res.json()

    return data.ok
  } catch (e) {
    console.log(e)
    return false
  }
}

export function newOrderMessage({
    orderId,
    name,
    phone,
    address,
    total,
    orderDetails,
    paymentStatus,
    comment
}){
  const currentDate = new Date()
  const dateStr = currentDate.toLocaleDateString('ru-RU')
  const timeStr = currentDate.toLocaleTimeString('ru-RU', { timeZone: 'Europe/Samara' })

  return `
Новый заказ в группе King Giros!
№${ orderId }
${ dateStr } / ${ timeStr }

ИНФОРМАЦИЯ О КЛИЕНТЕ:
Имя - ${ name }
Телефон - ${ phone }
Адрес доставки - ${ address }
Комментарий: ${ comment }
Статус оплаты: ${ paymentStatus }

ДЕТАЛИ ЗАКАЗА:
${ orderDetails }
ИТОГО: ${ total }
  `
}

export const getCartItemsStr = (items => items.reduce((prevStr, item) => `${ prevStr }${ item.title } x${ item.quantity } - ${ item.price.text }\n`, ''))