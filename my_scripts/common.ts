import { MainClient, NewSpotOrderParams, OrderResponseFull, OrderSide, OrderType, SymbolPrice } from "../src";
import { key, secret } from "./key";

const client = new MainClient({
    api_key: key,
    api_secret: secret,
    beautifyResponses: true,
  });

export class Common {

    trimToDecimalPlaces(number: number, precision: number): number {
        const array: any[] = number.toString().split('.');
        array.push(array.pop().substring(0, precision));
        const trimmedstr = array.join('.');
        return parseFloat(trimmedstr);
      }
    
    async marketOrderInSpot(symbol: string, side: OrderSide, symbolQuantity: number) {

        const orderRequest: NewSpotOrderParams = {
            symbol: symbol,
            quantity: symbolQuantity,
            side: side,
            type: 'MARKET',
            newOrderRespType: 'FULL'
        };
        await client.testNewOrder(orderRequest);
        const orderResult = await client.submitNewOrder(orderRequest) as OrderResponseFull;
        return orderResult
    }

    async orderInSpot(symbol: string, side: OrderSide, type: OrderType, symbolQuantity: number, atPrice: number) {

        const orderRequest: NewSpotOrderParams = {
            symbol: symbol,
            quantity: symbolQuantity,
            side: side,
            type: type,
            price: atPrice,
            timeInForce: 'GTC',
            /**
             * ACK = confirmation of order acceptance (no placement/fill information) -> OrderResponseACK
             * RESULT = fill state -> OrderResponseResult
             * FULL = fill state + detail on fills and other detail -> OrderResponseFull
             */
            newOrderRespType: 'FULL'
        };
        console.log('orderRequest====', orderRequest)
        await client.testNewOrder(orderRequest);
        const orderResult = await client.submitNewOrder(orderRequest) as OrderResponseFull;
        return orderResult
    }
    async buyLimitOrderInSpot(symbol: string, symbolQuantity: number, atPrice: number) {

        return await this.orderInSpot(symbol, 'BUY', 'LIMIT', symbolQuantity, atPrice)
    }

    async sellLimitOrderInSpot(symbol: string, symbolQuantity: number, atPrice: number) {

        return await this.orderInSpot(symbol, 'SELL', 'LIMIT', symbolQuantity, atPrice)
    }

    async buyMarketOrderInSpot(symbol: string, symbolQuantity: number) {

        return await this.marketOrderInSpot(symbol, 'BUY', symbolQuantity)
    }

    async sellMarketOrderInSpot(symbol: string, symbolQuantity: number) {

        return await this.marketOrderInSpot(symbol, 'SELL', symbolQuantity)
    }

    async cancelOrderInSpot(symbol : string) {
        try {
            await client.cancelAllSymbolOrders({symbol: symbol})
        } catch (error) {
            console.log('err===', error)
        }
    }

    async getAvailableUSDT() {
        const balance = await client.getBalances();

        const usdtBal = balance.find(assetBal => assetBal.coin === 'USDT');
        // console.log('USDT balance object: ', usdtBal);
    
        return usdtBal?.free
    }

    async getLastPrice(symbol: string) {
        const btcTicker = await client.getSymbolPriceTicker({ symbol: symbol }) as SymbolPrice;
        const lastPrice = btcTicker?.price;
        return lastPrice
    }
}