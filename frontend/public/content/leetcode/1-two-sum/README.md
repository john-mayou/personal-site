## [1. Two Sum](https://leetcode.com/problems/two-sum/description/)

---

Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

### Example

---

```
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
```

## Approach

---

The brute-force approach for this problem would be to loop over every possible combination of numbers until a solution is found. That solution would result in `O(n^2)` time and `O(1)` space, but we can do better.

The way to solve this problem in `O(n)` time would be to store a hashmap of the previously seen `value: index`. With that, if we have previously seen the complement, we know that to be the solution. This solution does have a worse `O(n)` space, although that seems like a reasonable trade.

```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i in range(len(nums)):
            complement = target - nums[i]
            if complement in seen:
                return [seen[complement], i]
            seen[nums[i]] = i
```
