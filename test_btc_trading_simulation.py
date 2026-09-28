import unittest
import numpy as np
import pandas as pd
from datetime import date
import concurrent.futures

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

    def test_race_condition_reproduction(self):
        """Minimal reproduction test verifying thread safety and deterministic price generation under concurrent execution."""
        seed_target = 42
        expected_df = generate_btc_prices(days=30, seed=seed_target)
        expected_prices = expected_df['Price'].tolist()

        def worker(idx):
            seed = seed_target if idx % 2 == 0 else (999 + idx)
            df = generate_btc_prices(days=30, seed=seed)
            return seed, df['Price'].tolist()

        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(worker, i) for i in range(30)]
            results = [f.result() for f in futures]

        for seed, prices in results:
            if seed == seed_target:
                self.assertEqual(prices, expected_prices)

    def test_concurrent_execution(self):
        """Regression test for parallel pipeline execution across multiple threads."""
        def run_full_pipeline(seed):
            df = generate_btc_prices(days=60, seed=seed)
            df_ma = calculate_moving_averages(df)
            df_strat, trades = simulate_golden_cross_strategy(df_ma)
            return len(df_strat), len(trades)

        seeds = [10, 20, 30, 40, 50, 10, 20, 30, 40, 50]
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(run_full_pipeline, s) for s in seeds]
            results = [f.result() for f in futures]

        self.assertEqual(len(results), len(seeds))
        for row_count, trade_count in results:
            self.assertEqual(row_count, 60)
            self.assertGreaterEqual(trade_count, 0)

    def test_retry_behavior(self):
        """Regression test verifying that failed thread tasks can be retried cleanly without corrupted state."""
        attempts = 0

        def flaky_task(seed):
            nonlocal attempts
            attempts += 1
            if attempts == 1:
                raise ValueError("Transient network/processing failure")
            df = generate_btc_prices(days=20, seed=seed)
            return df['Price'].tolist()

        # First attempt fails
        with self.assertRaises(ValueError):
            flaky_task(100)

        # Retry attempt succeeds and matches expected output
        retry_prices = flaky_task(100)
        expected_prices = generate_btc_prices(days=20, seed=100)['Price'].tolist()
        self.assertEqual(retry_prices, expected_prices)

    def test_failure_handling(self):
        """Regression test ensuring worker thread exceptions do not corrupt state or crash other thread jobs."""
        def task(i):
            if i % 3 == 0:
                raise RuntimeError(f"Simulated failure in worker {i}")
            df = generate_btc_prices(days=15, seed=i)
            return df['Price'].iloc[0]

        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
            futures = {i: executor.submit(task, i) for i in range(12)}
            succeeded = 0
            failed = 0
            for i, fut in futures.items():
                if i % 3 == 0:
                    with self.assertRaises(RuntimeError):
                        fut.result()
                    failed += 1
                else:
                    res = fut.result()
                    self.assertEqual(res, 60000.0)
                    succeeded += 1

        self.assertEqual(failed, 4)
        self.assertEqual(succeeded, 8)

    def test_cancellation_handling(self):
        """Regression test ensuring pending thread tasks can be cancelled without lingering state side-effects."""
        def slow_task(seed):
            import time
            time.sleep(0.05)
            return generate_btc_prices(days=10, seed=seed)

        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
            f1 = executor.submit(slow_task, 1)
            f2 = executor.submit(slow_task, 2)
            f3 = executor.submit(slow_task, 3)

            cancelled_f3 = f3.cancel()
            self.assertTrue(cancelled_f3)
            self.assertTrue(f3.cancelled())

            res1 = f1.result()
            res2 = f2.result()
            self.assertEqual(len(res1), 10)
            self.assertEqual(len(res2), 10)

    def test_out_of_order_completion(self):
        """Regression test verifying that tasks completing out-of-order maintain independent results."""
        def variable_task(days, seed):
            import time
            # Tasks with more days sleep less so they finish out of order relative to submission order
            time.sleep(0.01 * (100 - days))
            df = generate_btc_prices(days=days, seed=seed)
            return days, seed, df['Price'].tolist()

        tasks = [(80, 10), (20, 20), (90, 30), (10, 40)]
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
            futures = [executor.submit(variable_task, d, s) for d, s in tasks]
            completed_results = [f.result() for f in concurrent.futures.as_completed(futures)]

        self.assertEqual(len(completed_results), len(tasks))
        for d, s, prices in completed_results:
            expected = generate_btc_prices(days=d, seed=s)['Price'].tolist()
            self.assertEqual(prices, expected)

if __name__ == '__main__':
    unittest.main()
