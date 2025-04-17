## [39. Combination Sum](https://leetcode.com/problems/combination-sum/description/?envType=problem-list-v2&envId=r27zde7r)

Given an array of distinct integers `candidates` and a target integer `target`, return a list of all unique combinations of `candidates` where the chosen numbers sum to `target`. You may return the combinations in any order.

The same number may be chosen from `candidates` an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.

### Example

```
Input: candidates = [2,3,6,7], target = 7
Output: [[2,2,3],[7]]
Explanation:
2 and 3 are candidates, and 2 + 2 + 3 = 7. Note that 2 can be used multiple times.
7 is a candidate, and 7 = 7.
These are the only two combinations.
```

## Approach

```python
class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        results = []
        candidates.sort()

        def backtrack(index, curr, curr_sum):
            if curr_sum == target:
                results.append(curr[:])
                return
            for i in range(index, len(candidates)):
                if curr_sum + candidates[i] > target:
                    return
                curr.append(candidates[i])
                backtrack(i, curr, curr_sum + candidates[i])
                curr.pop()

        backtrack(0, [], 0)
        return results
```
