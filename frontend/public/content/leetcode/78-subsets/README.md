## [78. Subsets](https://leetcode.com/problems/subsets/description/?envType=problem-list-v2&envId=r27zde7r)

---

Given an integer array `nums` of unique elements, return all possible subsets (the power set).

The solution set must not contain duplicate subsets. Return the solution in any order.

### Example

---

```
Input: nums = [1,2,3]
Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
```

## Approach

---

```python
class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        output = []

        def backtrack(first, curr):
                output.append(curr[:])
                for i in range(first, len(nums)):
                    curr.append(nums[i])
                    backtrack(i + 1, curr)
                    curr.pop()

        backtrack(0, [])
        return output
```
