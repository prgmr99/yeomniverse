"""
One-Way Market Probability Index - Backtesting Script
Calculates and backtests the One-Way Market signal on S&P 500 data.
"""

import sys
import os

try:
    import pandas_ta as ta
except ImportError:
    print("pandas_ta가 필요합니다: pip install pandas_ta")
    sys.exit(1)

import numpy as np
import pandas as pd
import yfinance as yf
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
RESULTS_DIR = "/Users/yeomseungjun/Desktop/workplace/yeomniverse/finbrief/backtest/results"
os.makedirs(RESULTS_DIR, exist_ok=True)

CSV_PATH = os.path.join(RESULTS_DIR, "oneway_signals.csv")
PNG_PATH = os.path.join(RESULTS_DIR, "oneway_backtest.png")

# ---------------------------------------------------------------------------
# 1. Download data
# ---------------------------------------------------------------------------
print("데이터 다운로드 중...")
sp500 = yf.download("^GSPC", start="2020-01-01", auto_adjust=True, progress=False)
vix_raw = yf.download("^VIX", start="2020-01-01", auto_adjust=True, progress=False)

# Flatten MultiIndex columns if present
if isinstance(sp500.columns, pd.MultiIndex):
    sp500.columns = sp500.columns.get_level_values(0)
if isinstance(vix_raw.columns, pd.MultiIndex):
    vix_raw.columns = vix_raw.columns.get_level_values(0)

sp500.index = pd.to_datetime(sp500.index).tz_localize(None)
vix_raw.index = pd.to_datetime(vix_raw.index).tz_localize(None)

print(f"S&P500 rows: {len(sp500)}, VIX rows: {len(vix_raw)}")

# Align VIX to S&P500 dates
vix = vix_raw["Close"].reindex(sp500.index).ffill()

df = sp500[["Open", "High", "Low", "Close", "Volume"]].copy()
df["VIX"] = vix

# ---------------------------------------------------------------------------
# 2. Compute indicators (vectorised via pandas_ta)
# ---------------------------------------------------------------------------
print("지표 계산 중...")

# ADX
adx_result = df.ta.adx(length=14)
df["ADX_14"] = adx_result["ADX_14"]
df["DMP_14"] = adx_result["DMP_14"]
df["DMN_14"] = adx_result["DMN_14"]

# EMAs
df["EMA_8"]   = df.ta.ema(length=8)
df["EMA_21"]  = df.ta.ema(length=21)
df["EMA_50"]  = df.ta.ema(length=50)
df["EMA_200"] = df.ta.ema(length=200)

# RSI
df["RSI_14"] = df.ta.rsi(length=14)

# Bollinger Bands
bb = df.ta.bbands(length=20, std=2)
df["BBU"] = bb["BBU_20_2.0_2.0"]
df["BBM"] = bb["BBM_20_2.0_2.0"]
df["BBL"] = bb["BBL_20_2.0_2.0"]
df["BB_Width"] = (df["BBU"] - df["BBL"]) / df["BBM"]

# Volume moving averages
df["Vol_MA20"] = df["Volume"].rolling(20).mean()
df["Vol_MA50"] = df["Volume"].rolling(50).mean()

# BB Width percentile (rolling 252)
df["BB_Pct"] = df["BB_Width"].rolling(252).rank(pct=True) * 100

# BB expanding: last 10-day min * 1.2 < current
df["BB_Min10"] = df["BB_Width"].rolling(10).min()
df["BB_Expanding"] = df["BB_Width"] > df["BB_Min10"] * 1.2

# ---------------------------------------------------------------------------
# 3. Score calculation functions
# ---------------------------------------------------------------------------

def adx_score(adx: float) -> float:
    if np.isnan(adx):
        return 0
    if adx < 20:
        return 0
    elif adx < 25:
        return 30
    elif adx < 35:
        return 60
    elif adx < 50:
        return 85
    else:
        return 100


def ma_alignment_score(e8, e21, e50, e200):
    """Returns (score 0-100, bull_pairs, bear_pairs)."""
    emas = [e8, e21, e50, e200]
    if any(np.isnan(v) for v in emas):
        return 0, 0, 0
    pairs = [(0, 1), (0, 2), (0, 3), (1, 2), (1, 3), (2, 3)]
    bull_pairs = sum(1 for i, j in pairs if emas[i] > emas[j])
    bear_pairs = sum(1 for i, j in pairs if emas[i] < emas[j])
    score = (max(bull_pairs, bear_pairs) / 6) * 100
    return score, bull_pairs, bear_pairs


def rsi_score(rsi: float, direction: str) -> float:
    if np.isnan(rsi):
        return 10
    if direction == "bull":
        if 55 <= rsi < 65:
            return 100
        elif 65 <= rsi < 75:
            return 80
        elif 50 <= rsi < 55:
            return 50
        elif 75 <= rsi < 80:
            return 40
        elif rsi >= 80:
            return 20
        else:
            return 10
    else:  # bear
        if 35 <= rsi < 45:
            return 100
        elif 25 <= rsi < 35:
            return 80
        elif 45 <= rsi < 50:
            return 50
        elif 20 <= rsi < 25:
            return 40
        elif rsi < 20:
            return 20
        else:
            return 10


def bb_score(bb_pct: float, expanding: bool) -> float:
    if np.isnan(bb_pct):
        return 10
    if bb_pct >= 80 and expanding:
        return 100
    elif bb_pct >= 70 and expanding:
        return 85
    elif bb_pct >= 60:
        return 70
    elif bb_pct >= 40:
        return 50
    elif bb_pct >= 20:
        return 30
    else:
        return 10


def vix_score(vix_val: float, direction: str) -> float:
    if np.isnan(vix_val):
        return 20
    if direction == "bull":
        if 12 <= vix_val < 16:
            return 90
        elif 16 <= vix_val < 20:
            return 60
        elif 20 <= vix_val < 25:
            return 40
        elif 25 <= vix_val < 30:
            return 25
        elif vix_val >= 30:
            return 20
        else:  # < 12
            return 70
    else:  # bear
        if vix_val >= 35:
            return 90
        elif 30 <= vix_val < 35:
            return 80
        elif 25 <= vix_val < 30:
            return 65
        elif 20 <= vix_val < 25:
            return 45
        else:
            return 20


def volume_score(vol_ratio: float) -> float:
    if np.isnan(vol_ratio):
        return 10
    if vol_ratio >= 1.5:
        return 100
    elif vol_ratio >= 1.3:
        return 85
    elif vol_ratio >= 1.1:
        return 65
    elif vol_ratio >= 0.9:
        return 40
    elif vol_ratio >= 0.7:
        return 20
    else:
        return 10


def determine_direction(adx, dmp, dmn, bull_pairs, bear_pairs):
    if np.isnan(adx):
        return "neutral"
    if adx >= 25:
        if not (np.isnan(dmp) or np.isnan(dmn)):
            return "bull" if dmp > dmn else "bear"
    # ADX < 25: use MA alignment
    if bull_pairs > bear_pairs:
        return "bull"
    elif bear_pairs > bull_pairs:
        return "bear"
    return "neutral"


# ---------------------------------------------------------------------------
# 4. Vectorised score calculation across all rows
# ---------------------------------------------------------------------------
print("점수 계산 중...")

WEIGHTS = {
    "adx": 0.25,
    "ma":  0.20,
    "rsi": 0.15,
    "bb":  0.15,
    "vix": 0.10,
    "vol": 0.10,
    "fg":  0.05,
}
FG_FIXED = 50  # Fear & Greed fixed at neutral for backtesting

records = []
for date, row in df.iterrows():
    adx_val  = row["ADX_14"]
    dmp_val  = row["DMP_14"]
    dmn_val  = row["DMN_14"]
    e8, e21, e50, e200 = row["EMA_8"], row["EMA_21"], row["EMA_50"], row["EMA_200"]
    rsi_val  = row["RSI_14"]
    bb_pct   = row["BB_Pct"]
    bb_exp   = row["BB_Expanding"]
    vix_val  = row["VIX"]
    vol_ratio = row["Vol_MA20"] / row["Vol_MA50"] if row["Vol_MA50"] > 0 else np.nan

    ma_s, bull_p, bear_p = ma_alignment_score(e8, e21, e50, e200)
    direction = determine_direction(adx_val, dmp_val, dmn_val, bull_p, bear_p)

    a_score  = adx_score(adx_val)
    r_score  = rsi_score(rsi_val, direction)
    b_score  = bb_score(bb_pct, bb_exp)
    v_score  = vix_score(vix_val, direction)
    vol_s    = volume_score(vol_ratio)

    total = (
        a_score  * WEIGHTS["adx"] +
        ma_s     * WEIGHTS["ma"]  +
        r_score  * WEIGHTS["rsi"] +
        b_score  * WEIGHTS["bb"]  +
        v_score  * WEIGHTS["vix"] +
        vol_s    * WEIGHTS["vol"] +
        FG_FIXED * WEIGHTS["fg"]
    )

    records.append({
        "date":       date,
        "score":      round(total, 2),
        "direction":  direction,
        "adx_score":  a_score,
        "ma_score":   round(ma_s, 2),
        "rsi_score":  r_score,
        "bb_score":   b_score,
        "vix_score":  v_score,
        "vol_score":  vol_s,
    })

signals = pd.DataFrame(records).set_index("date")

# Drop rows before we have enough history (EMA_200 needs ~200, BB_Pct needs 252)
signals = signals[signals.index >= df.index[252]]

# ---------------------------------------------------------------------------
# 5. Forward returns
# ---------------------------------------------------------------------------
print("Forward return 계산 중...")
close = df["Close"]

for n in [5, 10, 20, 60]:
    fwd = close.shift(-n) / close - 1
    signals[f"fwd_ret_{n}d"] = fwd.reindex(signals.index)

# ---------------------------------------------------------------------------
# 6. Save CSV
# ---------------------------------------------------------------------------
signals.reset_index().rename(columns={"index": "date"}).to_csv(CSV_PATH, index=False)
print(f"CSV 저장: {CSV_PATH}")

# ---------------------------------------------------------------------------
# 7. Analysis
# ---------------------------------------------------------------------------
print("\n========== 분석 결과 ==========\n")

# --- 7a. Score buckets vs forward returns ---
buckets = pd.cut(signals["score"], bins=[0, 20, 40, 60, 80, 100],
                 labels=["0-20", "21-40", "41-60", "61-80", "81-100"])
signals["bucket"] = buckets

print("[ 점수 구간별 Forward Return ]")
for fwd_col in ["fwd_ret_5d", "fwd_ret_10d", "fwd_ret_20d", "fwd_ret_60d"]:
    print(f"\n  {fwd_col}:")
    grp = signals.groupby("bucket", observed=True)[fwd_col]
    tbl = grp.agg(
        mean=lambda x: x.mean(),
        median=lambda x: x.median(),
        std=lambda x: x.std(),
        pct_positive=lambda x: (x > 0).mean() * 100,
        n="count",
    )
    print(tbl.to_string())

# --- 7b. Direction accuracy ---
print("\n[ 방향 예측 정확도 (20일) ]")
bull_mask = (signals["score"] >= 60) & (signals["direction"] == "bull")
bear_mask = (signals["score"] >= 60) & (signals["direction"] == "bear")
neut_mask = signals["score"] < 40

bull_acc = (signals.loc[bull_mask, "fwd_ret_20d"] > 0).mean() * 100
bear_acc = (signals.loc[bear_mask, "fwd_ret_20d"] < 0).mean() * 100
neut_acc = (signals.loc[neut_mask, "fwd_ret_20d"].abs() < 0.02).mean() * 100

print(f"  Bull 시그널 (score>=60) → 20일 실제 상승 비율: {bull_acc:.1f}%  (n={bull_mask.sum()})")
print(f"  Bear 시그널 (score>=60) → 20일 실제 하락 비율: {bear_acc:.1f}%  (n={bear_mask.sum()})")
print(f"  중립 시그널 (score<40)  → 20일 ±2% 이내 비율: {neut_acc:.1f}%  (n={neut_mask.sum()})")

# --- 7c. t-test ---
high_grp = signals.loc[signals["score"] > 60, "fwd_ret_20d"].dropna()
low_grp  = signals.loc[signals["score"] < 40, "fwd_ret_20d"].dropna()
if len(high_grp) > 1 and len(low_grp) > 1:
    t_stat, p_val = stats.ttest_ind(high_grp, low_grp)
    print(f"\n[ t-test: score>60 vs score<40 (20일 return) ]")
    print(f"  t-statistic: {t_stat:.4f},  p-value: {p_val:.4f}")

# --- 7d. Trading strategy simulation ---
print("\n[ 전략 시뮬레이션 ]")

ret_daily = close.pct_change()

# Strategy A: score>=60+bull → long, score>=60+bear → cash, else hold
sig_a = pd.Series(0.0, index=signals.index)
sig_a[bull_mask] = 1.0
# hold = 0 for bear, 0 for rest (treat hold as 1 = market)
# reinterpret: "hold" means stay invested
hold_mask = ~bull_mask & ~bear_mask
sig_a[hold_mask] = 1.0  # hold = invested
# bear → 0 (cash) already

# Strategy B: score>=60+bull → long, score>=60+bear → short (inverse), else cash
sig_b = pd.Series(0.0, index=signals.index)
sig_b[bull_mask] = 1.0
sig_b[bear_mask] = -1.0

daily_ret = ret_daily.reindex(signals.index)

ret_a = (sig_a.shift(1) * daily_ret).dropna()
ret_b = (sig_b.shift(1) * daily_ret).dropna()
ret_bh = daily_ret.reindex(ret_a.index).dropna()
ret_a = ret_a.reindex(ret_bh.index)
ret_b = ret_b.reindex(ret_bh.index)

cum_a  = (1 + ret_a).cumprod()
cum_b  = (1 + ret_b).cumprod()
cum_bh = (1 + ret_bh).cumprod()


def sharpe(r, ann=252):
    if r.std() == 0:
        return 0
    return (r.mean() / r.std()) * np.sqrt(ann)


def max_drawdown(cum):
    roll_max = cum.cummax()
    dd = (cum - roll_max) / roll_max
    return dd.min()


print(f"  Strategy A:  총수익률={cum_a.iloc[-1]-1:.1%}  샤프={sharpe(ret_a):.2f}  MDD={max_drawdown(cum_a):.1%}")
print(f"  Strategy B:  총수익률={cum_b.iloc[-1]-1:.1%}  샤프={sharpe(ret_b):.2f}  MDD={max_drawdown(cum_b):.1%}")
print(f"  Buy & Hold:  총수익률={cum_bh.iloc[-1]-1:.1%}  샤프={sharpe(ret_bh):.2f}  MDD={max_drawdown(cum_bh):.1%}")

# ---------------------------------------------------------------------------
# 8. Visualisation
# ---------------------------------------------------------------------------
print("\n시각화 생성 중...")

fig, axes = plt.subplots(4, 2, figsize=(18, 28))
fig.suptitle("One-Way Market Probability Index - Backtest Analysis", fontsize=16, fontweight="bold")

# Colour helper for score
def score_color(s):
    if s < 40:
        return "steelblue"
    elif s < 60:
        return "gray"
    elif s < 80:
        return "darkorange"
    else:
        return "crimson"

# [0,0] Score time series
ax = axes[0, 0]
colors = [score_color(s) for s in signals["score"]]
ax.bar(signals.index, signals["score"], color=colors, width=1, alpha=0.8)
ax.axhline(60, color="darkorange", linestyle="--", linewidth=0.8, label="60")
ax.axhline(40, color="steelblue",  linestyle="--", linewidth=0.8, label="40")
ax.set_title("One-Way Score 시계열")
ax.set_ylabel("Score")
ax.legend(fontsize=8)
patches = [
    mpatches.Patch(color="steelblue",  label="<40 (Weak)"),
    mpatches.Patch(color="gray",       label="40-60 (Neutral)"),
    mpatches.Patch(color="darkorange", label="60-80 (Strong)"),
    mpatches.Patch(color="crimson",    label="80+ (Very Strong)"),
]
ax.legend(handles=patches, fontsize=7, loc="upper left")

# [0,1] 20일 forward return box plot by bucket
ax = axes[0, 1]
bucket_groups = [signals.loc[signals["bucket"] == b, "fwd_ret_20d"].dropna() * 100
                 for b in ["0-20", "21-40", "41-60", "61-80", "81-100"]]
bp = ax.boxplot(bucket_groups, labels=["0-20", "21-40", "41-60", "61-80", "81-100"],
                patch_artist=True, notch=False)
bucket_colors = ["steelblue", "lightblue", "lightgray", "orange", "crimson"]
for patch, c in zip(bp["boxes"], bucket_colors):
    patch.set_facecolor(c)
ax.axhline(0, color="black", linestyle="--", linewidth=0.8)
ax.set_title("점수 구간별 20일 Forward Return (%)")
ax.set_xlabel("Score Bucket")
ax.set_ylabel("Return (%)")

# [1,0] S&P500 price + bull/bear signals
ax = axes[1, 0]
ax.plot(close.reindex(signals.index), color="black", linewidth=0.8, label="S&P500")
bull_idx = signals.index[bull_mask]
bear_idx = signals.index[bear_mask]
ax.scatter(bull_idx, close.reindex(bull_idx),
           marker="^", color="green", s=12, alpha=0.6, label="Bull (≥60)", zorder=5)
ax.scatter(bear_idx, close.reindex(bear_idx),
           marker="v", color="red", s=12, alpha=0.6, label="Bear (≥60)", zorder=5)
ax.set_title("S&P500 + Bull/Bear 시그널")
ax.set_ylabel("Price")
ax.legend(fontsize=8)

# [1,1] Direction accuracy bar chart
ax = axes[1, 1]
acc_data = {
    "Bull\n(score≥60)": bull_acc,
    "Bear\n(score≥60)": bear_acc,
    "Neutral\n(score<40)": neut_acc,
}
bars = ax.bar(acc_data.keys(), acc_data.values(),
              color=["green", "red", "gray"], alpha=0.8)
ax.axhline(50, color="black", linestyle="--", linewidth=0.8, label="50% base")
ax.set_ylim(0, 105)
ax.set_title("방향 예측 정확도 (%)")
ax.set_ylabel("Accuracy (%)")
for bar, val in zip(bars, acc_data.values()):
    ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 1,
            f"{val:.1f}%", ha="center", va="bottom", fontsize=9)

# [2,0] Cumulative return comparison
ax = axes[2, 0]
ax.plot(cum_bh.index, cum_bh.values, color="black",      linewidth=1.2, label="Buy & Hold")
ax.plot(cum_a.index,  cum_a.values,  color="darkorange",  linewidth=1.2, label="Strategy A")
ax.plot(cum_b.index,  cum_b.values,  color="steelblue",   linewidth=1.2, label="Strategy B")
ax.axhline(1, color="gray", linestyle="--", linewidth=0.6)
ax.set_title("전략 누적 수익률 비교")
ax.set_ylabel("Cumulative Return")
ax.legend(fontsize=8)

# [2,1] Score distribution histogram
ax = axes[2, 1]
ax.hist(signals["score"].dropna(), bins=30, color="steelblue", edgecolor="white", alpha=0.8)
ax.axvline(40, color="gray",       linestyle="--", linewidth=0.8, label="40")
ax.axvline(60, color="darkorange", linestyle="--", linewidth=0.8, label="60")
ax.set_title("Score 분포 히스토그램")
ax.set_xlabel("Score")
ax.set_ylabel("Count")
ax.legend(fontsize=8)

# [3,0] Forward returns vs score (scatter, 4 horizons)
ax = axes[3, 0]
horizon_colors = {"fwd_ret_5d": "steelblue", "fwd_ret_10d": "green",
                  "fwd_ret_20d": "darkorange", "fwd_ret_60d": "crimson"}
for col, c in horizon_colors.items():
    sub = signals[["score", col]].dropna()
    ax.scatter(sub["score"], sub[col] * 100, alpha=0.15, s=5, color=c,
               label=col.replace("fwd_ret_", "").replace("d", "d"))
ax.axhline(0, color="black", linestyle="--", linewidth=0.6)
ax.set_title("Forward Return vs Score (산점도)")
ax.set_xlabel("Score")
ax.set_ylabel("Return (%)")
ax.legend(fontsize=8, markerscale=3)

# [3,1] ADX vs OneWay Score scatter
ax = axes[3, 1]
sub = signals[["score", "adx_score"]].copy()
sub["adx_raw"] = df["ADX_14"].reindex(signals.index)
sub = sub.dropna()
sc = ax.scatter(sub["adx_raw"], sub["score"], alpha=0.3, s=8,
                c=sub["score"], cmap="RdYlGn", vmin=0, vmax=100)
plt.colorbar(sc, ax=ax, label="Score")
ax.set_title("ADX vs OneWay Score")
ax.set_xlabel("ADX (raw value)")
ax.set_ylabel("OneWay Score")

plt.tight_layout(rect=[0, 0, 1, 0.97])
plt.savefig(PNG_PATH, dpi=120, bbox_inches="tight")
plt.close()
print(f"PNG 저장: {PNG_PATH}")

print("\n백테스팅 완료.")
