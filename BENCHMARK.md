# Results of benchmark

I've spent some time to increase the performance of this module, and I've used nano-bench 1.2.0 for benchmark and compare code.
In this file you will find the results of the improvements.

## Test execution

```
yarn benchmark:large
yarn benchmark:small
```

## With large deck code

Confidence interval: 95% bootstrap-percentile of the median (1,000 resamples), samples: 100
Measuring 50ms per sample (~10s per function)

| name            | time median | +        | −        | op/s | batch |
| --------------- | ----------- | -------- | -------- | ---- | ----- |
| decode_small_v1 | 1.427μs     | +0.118μs | −0.019μs | 701k | 50k   |
| decode_small_v2 | 1.186μs     | +0.178μs | −0.030μs | 843k | 50k   |
| decode_small_v3 | 989ns       | +77ns    | −21ns    | 1M   | 50k   |

Significance: Kruskal–Wallis H test, α = 0.05; post-hoc: Conover–Iman pairwise (Holm-corrected, m=3)
The difference is statistically significant:

|     | #   | name            | 1            | 2            | 3            |
| --- | ---- | --------------- | ------------ | ------------ | ------------ |
| 🐢  | 1    | decode_large_v1 |              | 16% slower   | 33.8% slower |
|     | 2    | decode_large_v2 | 19% faster   |              | 21.2% slower |
| 🐇  | 3    | decode_large_v3 | 50.9% faster | 26.8% faster |              |

## With small deck code

Confidence interval: 95% bootstrap-percentile of the median (1,000 resamples), samples: 100
Measuring 50ms per sample (~10s per function)

| name            | time median | +        | −        | op/s | batch |
| --------------- | ----------- | -------- | -------- | ---- | ----- |
| decode_small_v1 | 1.399μs     | +0.118μs | −0.018μs | 715k | 50k   |
| decode_small_v2 | 1.176μs     | +0.085μs | −0.038μs | 850k | 50k   |
| decode_small_v3 | 946ns       | +97ns    | −13ns    | 1M   | 100k  |

Significance: Kruskal–Wallis H test, α = 0.05; post-hoc: Conover–Iman pairwise (Holm-corrected, m=3)
The difference is statistically significant:

|     | #   | name            | 1            | 2            | 3            |
| --- | --- | --------------- | ------------ | ------------ | ------------ |
| 🐢  | 1   | decode_small_v1 |              | 16% slower   | 32.4% slower |
|     | 2   | decode_small_v2 | 19% faster   |              | 19.5% slower |
| 🐇  | 3   | decode_small_v3 | 47.9% faster | 24.3% faster |              |
