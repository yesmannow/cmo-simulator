# CMO Simulator: Engine & Mathematical Spec

## 1. Core Simulation Loop (MMM Foundation)
The core engine is a deterministic Marketing Mix Model (MMM). 
`runSimulationTick(previousState, playerInputs, marketConditions) -> newState`

### 1.1 Base vs. Incremental Sales
Total sales must be decomposed into base and incremental components.
- **Base Sales**: Driven by brand equity, seasonality, economic index, pricing.
- **Incremental Sales**: Driven directly by current marketing spend and promotions.

## 2. Marketing Dynamics Math
### 2.1 Adstock (Carryover Effect / Memory)
Marketing impact doesn't vanish instantly. We use geometric decay to model brand memory.
- **Equation**: $Adstock_t = Spend_t + (\lambda \times Adstock_{t-1})$
- **$\lambda$ (Lambda)**: Decay rate (0 to 1). High for Brand/TV (e.g., 0.8), low for Search/Digital (e.g., 0.2).
- **Player Impact**: Allows "pulsing" strategies (heavy spend followed by low maintenance).

### 2.2 Saturation (Diminishing Returns)
The 1st million spent is highly effective; the 10th million yields marginal gains. We use the **Hill Function** or **Logistic S-Curve**.
- **Equation**: $Impact(x) = \frac{Max\_Impact \times (Adstocked\_Spend)^n}{Half\_Sat\_Point^n + (Adstocked\_Spend)^n}$
- **Half Saturation ($K_d$)**: Spend required to hit 50% max impact.
- **Slope ($n$)**: Determines steepness of the curve.
- **Player Impact**: Forces the player to diversify channels and optimize marginal ROI instead of blindly overspending on one tactic.

### 2.3 Synergy & Cannibalization Matrix
An $N \times N$ matrix applying cross-channel multipliers. 
- **Positive Interaction (Synergy)**: e.g., $1.15x$ multiplier when Brand Search works tandem with TV ads.
- **Negative Interaction (Cannibalization)**: e.g., $0.85x$ multiplier when two overlapping digital campaigns bid against each other.

## 3. Product & Market Fit Math
### 3.1 Perceptual Mapping (Multidimensional Scaling - MDS)
Positions map on a 2D axis (e.g., Price vs. Performance).
- **Ideal Point**: Consumer target coordinates $(X_{ideal}, Y_{ideal})$. Consumer desires drift over time!
- **Brand Position**: Current coordinates $(X_{brand}, Y_{brand})$.
- **Equation**: Distance $d = \sqrt{(X_{brand} - X_{ideal})^2 + (Y_{brand} - Y_{ideal})^2}$
- **Player Impact**: Distance dictates market share potential. Players must use R&D or Perceptual Advertising to close the distance.

### 3.2 Target Base Cost & Margins
Maximum production base cost allowed before margins thin out.
- **Target Base Cost** = Target Retail Price - Distributor Margin - Corporate Desired Margin
- **Experience Curve**: Unit cost decreases by 15% for every doubling of cumulative production volume.

### 3.3 Multi-Attribute Utility Theory
- **Utility Score**: $U = \sum (Weight_i \times Rating_i)$ per segment.
- **Market Share**: $Share = \frac{U_{brand}}{\sum U_{competitors}}$

## 4. Performance Metrics & Scoring
### 4.1 Share Price Index (SPI)
The composite ranking score denoting long-term value creation.
- **SPI** = $f(Net\_Contribution, Market\_Share\_Growth, R\&D\_Strength)$

### 4.2 Customer Lifetime Value (LTV) & CAC
- **LTV Equation**: $\sum \frac{Revenue_t \times Retention\_Rate^t}{(1+Discount\_Rate)^t} - CAC$
- **Player Impact**: Short-term thinkers cutting CAC but increasing churn will be mathematically punished with a leaky bucket.

## 5. Stochastic Chaos & Risk
### 5.1 Probabilistic Events ("Oregon Trail" Logic)
Using Bayesian models, actions alter probability distributions of crises.
- **Probability of Bug/Recall**: $P(Recall) = e^{-k \cdot Development\_Time}$
- **Crisis Trigger**: Base probability heavily affected by player's "Trust Multiplier" and cash reserves.
