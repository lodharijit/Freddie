import numpy as np
import pandas as pd
from datetime import datetime, timedelta

def generate_btc_prices(days=60, start_price=60000.0, mu=0.10, sigma=0.65, seed=42):
    """
    Simulates daily Bitcoin prices using Geometric Brownian Motion (GBM).

    Parameters:
        days (int): Number of simulation days.
        start_price (float): Initial BTC price in USD.
        mu (float): Annualized drift (expected return).
        sigma (float): Annualized volatility.
        seed (int): Random seed for reproducibility.

    Returns:
        pd.DataFrame: DataFrame containing Day, Date, and Price columns.
    """
    np.random.seed(seed)
    dt = 1 / 365.0  # Daily time step for 365 days/year crypto market

    # Geometric Brownian Motion formula:
    # S_t = S_0 * exp(cumsum((mu - 0.5 * sigma^2)*dt + sigma * sqrt(dt) * Z_t))
    daily_returns = np.random.normal(
        (mu - 0.5 * sigma ** 2) * dt,
        sigma * np.sqrt(dt),
        size=days
    )

    # Calculate price trajectory
    price_factors = np.exp(daily_returns)
    prices = np.zeros(days)
    prices[0] = start_price
    for t in range(1, days):
        prices[t] = prices[t-1] * price_factors[t]

    start_date = datetime.now().date()
    dates = [start_date + timedelta(days=i) for i in range(days)]

    df = pd.DataFrame({
        'Day': np.arange(1, days + 1),
        'Date': dates,
        'Price': prices
    })
    return df

def calculate_moving_averages(df, short_window=7, long_window=30):
    """
    Calculates short-term (7-day) and long-term (30-day) Simple Moving Averages.

    Parameters:
        df (pd.DataFrame): DataFrame with 'Price' column.
        short_window (int): Short MA window.
        long_window (int): Long MA window.

    Returns:
        pd.DataFrame: Updated DataFrame with MA_7 and MA_30 columns.
    """
    df = df.copy()
    df['MA_7'] = df['Price'].rolling(window=short_window, min_periods=short_window).mean()
    df['MA_30'] = df['Price'].rolling(window=long_window, min_periods=long_window).mean()
    return df

def simulate_golden_cross_strategy(df, initial_capital=10000.0):
    """
    Executes a Golden Cross trading strategy:
    - Golden Cross (MA_7 crosses above MA_30): BUY (allocate full cash balance to BTC).
    - Death Cross (MA_7 crosses below MA_30): SELL (liquidate full BTC holdings to cash).

    Parameters:
        df (pd.DataFrame): DataFrame containing Price, MA_7, and MA_30.
        initial_capital (float): Initial capital in USD.

    Returns:
        pd.DataFrame: Updated DataFrame with trading actions, holdings, and portfolio metrics.
    """
    df = df.copy()

    cash = initial_capital
    btc_holdings = 0.0

    actions = []
    cash_history = []
    btc_history = []
    portfolio_values = []
    trades = []

    for i in range(len(df)):
        current_price = df.loc[i, 'Price']
        ma_7 = df.loc[i, 'MA_7']
        ma_30 = df.loc[i, 'MA_30']

        action = "HOLD"

        # We need both MAs to be valid and at least one previous day of both MAs to check crossover
        if i > 0 and pd.notna(df.loc[i-1, 'MA_7']) and pd.notna(df.loc[i-1, 'MA_30']) and pd.notna(ma_7) and pd.notna(ma_30):
            prev_ma_7 = df.loc[i-1, 'MA_7']
            prev_ma_30 = df.loc[i-1, 'MA_30']

            # Golden Cross: MA_7 crosses above MA_30
            if prev_ma_7 <= prev_ma_30 and ma_7 > ma_30:
                if cash > 0:
                    btc_holdings = cash / current_price
                    cash = 0.0
                    action = "BUY"
                    trades.append({
                        'Day': df.loc[i, 'Day'],
                        'Date': df.loc[i, 'Date'],
                        'Action': 'BUY',
                        'Price': current_price,
                        'BTC': btc_holdings
                    })
            # Death Cross: MA_7 crosses below MA_30
            elif prev_ma_7 >= prev_ma_30 and ma_7 < ma_30:
                if btc_holdings > 0:
                    cash = btc_holdings * current_price
                    sold_btc = btc_holdings
                    btc_holdings = 0.0
                    action = "SELL"
                    trades.append({
                        'Day': df.loc[i, 'Day'],
                        'Date': df.loc[i, 'Date'],
                        'Action': 'SELL',
                        'Price': current_price,
                        'BTC': sold_btc
                    })

        total_value = cash + (btc_holdings * current_price)

        actions.append(action)
        cash_history.append(cash)
        btc_history.append(btc_holdings)
        portfolio_values.append(total_value)

    df['Action'] = actions
    df['Cash'] = cash_history
    df['BTC_Holdings'] = btc_history
    df['Portfolio_Value'] = portfolio_values

    return df, trades

def print_daily_ledger(df):
    """Prints a formatted daily trading ledger."""
    print("=" * 110)
    print(f"{'DAY':<5} | {'DATE':<12} | {'PRICE ($)':<12} | {'MA_7 ($)':<12} | {'MA_30 ($)':<12} | {'ACTION':<6} | {'CASH ($)':<12} | {'BTC HELD':<10} | {'PORTFOLIO ($)':<12}")
    print("=" * 110)

    for _, row in df.iterrows():
        day = int(row['Day'])
        date_str = str(row['Date'])
        price = f"${row['Price']:,.2f}"
        ma_7 = f"${row['MA_7']:,.2f}" if pd.notna(row['MA_7']) else "N/A"
        ma_30 = f"${row['MA_30']:,.2f}" if pd.notna(row['MA_30']) else "N/A"
        action = row['Action']
        cash = f"${row['Cash']:,.2f}"
        btc = f"{row['BTC_Holdings']:.4f}"
        portfolio = f"${row['Portfolio_Value']:,.2f}"

        # Highlight BUY / SELL actions
        action_str = f"**{action}**" if action in ['BUY', 'SELL'] else action
        print(f"{day:<5} | {date_str:<12} | {price:<12} | {ma_7:<12} | {ma_30:<12} | {action_str:<6} | {cash:<12} | {btc:<10} | {portfolio:<12}")
    print("=" * 110)

def print_performance_summary(df, trades, initial_capital):
    """Prints a summary of the trading portfolio performance vs buy-and-hold benchmark."""
    final_day = df.iloc[-1]
    final_value = final_day['Portfolio_Value']
    strategy_return = ((final_value - initial_capital) / initial_capital) * 100

    start_price = df.iloc[0]['Price']
    end_price = final_day['Price']
    buy_hold_value = initial_capital * (end_price / start_price)
    buy_hold_return = ((buy_hold_value - initial_capital) / initial_capital) * 100

    print("\n" + "#" * 50)
    print("           PORTFOLIO PERFORMANCE SUMMARY")
    print("#" * 50)
    print(f"Simulation Period       : {len(df)} days")
    print(f"Initial Capital         : ${initial_capital:,.2f}")
    print(f"Starting BTC Price      : ${start_price:,.2f}")
    print(f"Ending BTC Price        : ${end_price:,.2f} ({((end_price - start_price) / start_price) * 100:+.2f}%)")
    print("-" * 50)
    print(f"Total Trades Executed   : {len(trades)}")
    for t in trades:
        print(f"  - Day {t['Day']} ({t['Date']}): {t['Action']} at ${t['Price']:,.2f} ({t['BTC']:.4f} BTC)")
    print("-" * 50)
    print(f"Final Strategy Value    : ${final_value:,.2f}")
    print(f"Strategy Total Return   : {strategy_return:+.2f}%")
    print(f"Buy & Hold Value        : ${buy_hold_value:,.2f}")
    print(f"Buy & Hold Return       : {buy_hold_return:+.2f}%")
    print(f"Strategy vs Benchmark   : {strategy_return - buy_hold_return:+.2f}% p.p.")
    print("#" * 50 + "\n")

def main():
    initial_capital = 10000.0
    days = 60

    # 1. Simulate BTC prices
    df = generate_btc_prices(days=days, start_price=60000.0, mu=0.50, sigma=0.80, seed=12)

    # 2. Calculate moving averages
    df = calculate_moving_averages(df, short_window=7, long_window=30)

    # 3. Simulate Golden Cross trading strategy
    df, trades = simulate_golden_cross_strategy(df, initial_capital=initial_capital)

    # 4. Print daily ledger
    print_daily_ledger(df)

    # 5. Print summary performance
    print_performance_summary(df, trades, initial_capital)

if __name__ == '__main__':
    main()
