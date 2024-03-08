import { Common } from './common';

const MyCommon = new Common()
const symbol = {name: 'PEOPLEUSDT', quantityDecimalPrecision: 0, priceDecimalPrecision: 5}
// const symbol = {name: 'AMBUSDT', quantityDecimalPrecision: 0, priceDecimalPrecision: 5}
// const symbol = {name: 'MEMEUSDT', quantityDecimalPrecision: 0, priceDecimalPrecision: 6}
// const symbol = {name: 'VOXELUSDT', quantityDecimalPrecision: 0, priceDecimalPrecision: 4}
// const symbol = {name: 'BLZUSDT', quantityDecimalPrecision: 0, priceDecimalPrecision: 4}
// const symbol = {name: 'PIXELUSDT', quantityDecimalPrecision: 0, priceDecimalPrecision: 4}

const dcaVal = 50; // 50usdt
const dcaPercentMax = 18
const initAmountUsdt = 100

async function run() {
  try {
    let balance = await MyCommon.getAvailableUSDT()

    if (!balance) {
      balance = 0
    }

    let total = initAmountUsdt + dcaPercentMax * dcaVal

    if (typeof balance == 'string') {
      balance = parseFloat(balance);
    }

    console.error('total === ', total);
    console.error('balance === ', balance);
    if (total > balance) {
      console.error('Error: Lack of usdt for create order');
      return
    }


    let lastPrice = await MyCommon.getLastPrice(symbol.name)
    if (!lastPrice) {
      return console.error('Error: no price returned');
    }

    const buy1 = (initAmountUsdt / Number(lastPrice)).toFixed(symbol.quantityDecimalPrecision);
    console.log('buy0===', buy1, ' , at price: ', lastPrice)

    await MyCommon.buyMarketOrderInSpot(symbol.name, parseFloat(buy1))

    // lastPrice = 0.04501

    for (let index = 1; index <= dcaPercentMax; index++) {
      let nextPrice = (Number(lastPrice) * (100 - index))/100
      let nextPriceUpdate = nextPrice.toFixed(symbol.priceDecimalPrecision)
      nextPrice = parseFloat(nextPriceUpdate)
      let buyx = (dcaVal / nextPrice).toFixed(symbol.quantityDecimalPrecision);
      console.log('buy' + index + '===', buyx, ' , at price: ', nextPrice)
      await MyCommon.buyLimitOrderInSpot(symbol.name, parseFloat(buyx), nextPrice)
    }


  } catch (e) {
    console.error('Error: request failed: ', e);
  }
};

// MyCommon.cancelOrderInSpot('PEOPLEUSDT')
// MyCommon.cancelOrderInSpot('MEMEUSDT')
// MyCommon.cancelOrderInSpot('VOXELUSDT')
// MyCommon.cancelOrderInSpot('BLZUSDT')
// MyCommon.cancelOrderInSpot('PIXELUSDT')
run()
