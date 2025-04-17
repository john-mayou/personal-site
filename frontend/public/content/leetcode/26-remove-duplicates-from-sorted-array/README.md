## [26. Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/description/?envType=problem-list-v2&envId=r27zde7r)

Given an integer array `nums` sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same. Then return the number of unique elements in `nums`.

### Example

```
Input: nums = [1,1,2]
Output: 2, nums = [1,2,_]
Explanation: Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively.
It does not matter what you leave beyond the returned k (hence they are underscores).
```

## Approach

The brute-force approach for removing duplicates would be to `list(set(nums))`, although that would result in `O(n)` time and `O(n)` space and is not an in place algorithm.

A better approach (within the bounds of the problem) is to use a two pointer technique. The key insight here is that since the input array is sorted, duplicate numbers must be next to each other.

If we compare values next to each other and they are not equal, we know the second value must not be a duplicate (so far). We can keep an insertion pointer to write those "new" values when we find them and increment the pointer.

At the end, we know all indices before where the insertion pointer ended are all unique (within that range), which solves the problem.

This solution runs in `O(n)` time with `O(1)` space.

```python
class Solution:
    def removeDuplicates(self, nums: List[int]) -> int:
        insert = 1
        for i in range(1, len(nums)):
            if nums[i] != nums[i - 1]:
                nums[insert] = nums[i]
                insert += 1
        return insert
```
