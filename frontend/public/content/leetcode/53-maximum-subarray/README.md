## [53. Maximum Subarray](https://leetcode.com/problems/maximum-subarray/description/?envType=problem-list-v2&envId=r27zde7r)

Given an integer array `nums`, find the subarray with the largest sum, and return its sum.

### Example

```
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.
```

## Approach

```python
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        maxSum = nums[0]
        curSum = 0
        for num in nums:
            curSum = max(curSum, 0) + num
            maxSum = max(maxSum, curSum)
        return maxSum
```
