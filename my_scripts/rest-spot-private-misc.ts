import { MainClient } from '../src/index';

// or
// import { MainClient } from 'binance';

const key = '07on7oHeBHnxuq4aQHY3wPdtvrBe5RJl4eESSPSj8EOdAkmC7qpyZRePcnDMmyBs';
const secret = 'xgD72vc5euxMKLlub4aFgoii0pbyjozZdZt92ng8CnM8xL1wfzhmCFxoxMYMj8hw';

const client = new MainClient({
  api_key: key,
  api_secret: secret,
});

(async () => {
  try {
    console.log('getAccountStatus: ', await client.getAccountStatus());
    console.log('getApiTradingStatus: ', await client.getApiTradingStatus());
    console.log('getApiKeyPermissions: ', await client.getApiKeyPermissions());
  } catch (e) {
    console.error('request failed: ', e);
  }
})();
