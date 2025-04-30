## [80. Remove Duplicates from Sorted Array II](https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/description/?envType=problem-list-v2&envId=r27zde7r)

---

Given an integer array `nums` sorted in non-decreasing order, remove some duplicates in-place such that each unique element appears at most twice. The relative order of the elements should be kept the same.

### Example

---

```
Input: nums = [1,1,1,2,2,3]
Output: 5, nums = [1,1,2,2,3,_]
Explanation: Your function should return k = 5, with the first five elements of nums being 1, 1, 2, 2 and 3 respectively.
It does not matter what you leave beyond the returned k (hence they are underscores).
```

## Approach

---

```python
class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        l = r = 0
        while r < len(nums):
            num = nums[r]
            count = 0
            while r < len(nums) and num == nums[r]:
                count += 1
                r += 1
            for _ in range(min(2, count)):
                nums[l] = num
                l += 1
        return l

```
