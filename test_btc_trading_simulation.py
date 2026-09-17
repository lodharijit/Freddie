import unittest
import numpy as np
import pandas as pd
from datetime import date

from btc_trading_simulation import (
    generate_btc_prices,
    calculate_moving_averages,
    simulate_golden_cross_strategy
)

class TestBitcoinTradingSimulation(unittest.TestCase):

    def test_generate_btc_prices(self):
        days = 60
        start_price = 50000.0
        df = generate_btc_prices(days=days, start_price=start_price, seed=123)

        self.assertEqual(len(df), days)
        self.assertIn('Day', df.columns)
        self.assertIn('Date', df.columns)
        self.assertIn('Price', df.columns)
        self.assertEqual(df.iloc[0]['Price'], start_price)
        self.assertTrue((df['Price'] > 0).all())
        self.assertTrue(isinstance(df.iloc[0]['Date'], date))

    def test_calculate_moving_averages(self):
        prices = [10.0] * 35
        df = pd.DataFrame({'Day': range(1, 36), 'Price': prices})
        df_ma = calculate_moving_averages(df, short_window=7, long_window=30)

        # Check NaN for periods < window
        self.assertTrue(pd.isna(df_ma.loc[5, 'MA_7']))
        self.assertEqual(df_ma.loc[6, 'MA_7'], 10.0)

        self.assertTrue(pd.isna(df_ma.loc[28, 'MA_30']))
        self.assertEqual(df_ma.loc[29, 'MA_30'], 10.0)

    def test_golden_cross_buy_signal(self):
        # Create a mock dataframe where MA_7 crosses above MA_30
        data = {
            'Day': [1, 2, 3, 4],
            'Date': [date(2025, 1, i) for i in range(1, 5)],
            'Price': [100.0, 100.0, 120.0, 130.0],
            'MA_7': [90.0, 95.0, 105.0, 115.0],
            'MA_30': [92.0, 96.0, 100.0, 102.0]  # Day 2: MA_7 <= MA_30 (95 <= 96), Day 3: MA_7 > MA_30 (105 > 100) -> Golden Cross
        }
        df = pd.DataFrame(data)

        df_res, trades = simulate_golden_cross_strategy(df, initial_capital=1000.0)

        self.assertEqual(df_res.loc[2, 'Action'], 'BUY')
        self.assertEqual(len(trades), 1)
        self.assertEqual(trades[0]['Action'], 'BUY')
        self.assertEqual(trades[0]['Price'], 120.0)
        self.assertAlmostEqual(trades[0]['BTC'], 1000.0 / 120.0)
        self.assertEqual(df_res.loc[2, 'Cash'], 0.0)

    def test_death_cross_sell_signal(self):
        # Create a mock dataframe where MA_7 crosses below MA_30 after holding BTC
        data = {
            'Day': [1, 2, 3, 4, 5],
            'Date': [date(2025, 1, i) for i in range(1, 6)],
            'Price': [100.0, 100.0, 120.0, 110.0, 90.0],
            'MA_7': [90.0, 95.0, 105.0, 102.0, 90.0],
            'MA_30': [92.0, 96.0, 100.0, 101.0, 95.0]
            # Day 3: Golden Cross (prev MA_7 95 <= prev MA_30 96, curr MA_7 105 > curr MA_30 100), Buy at 120
            # Day 5: Death Cross (prev MA_7 102 >= prev MA_30 101, curr MA_7 90 < curr MA_30 95), Sell at 90
        }
        df = pd.DataFrame(data)

        df_res, trades = simulate_golden_cross_strategy(df, initial_capital=1200.0)

        self.assertEqual(df_res.loc[2, 'Action'], 'BUY')
        self.assertEqual(df_res.loc[4, 'Action'], 'SELL')
        self.assertEqual(len(trades), 2)
        self.assertEqual(df_res.loc[4]['BTC_Holdings'], 0.0)
        # Bought 10 BTC at 120 for 1200 cash. Sold 10 BTC at 90 = 900 cash.
        self.assertAlmostEqual(df_res.loc[4]['Cash'], 900.0)
        self.assertAlmostEqual(df_res.loc[4]['Portfolio_Value'], 900.0)

if __name__ == '__main__':
    unittest.main()
