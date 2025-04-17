## [27. Remove Element](https://leetcode.com/problems/remove-element/description/?envType=problem-list-v2&envId=r27zde7r)

Given an integer array `nums` and an integer `val`, remove all occurrences of `val` in `nums` in-place. The order of the elements may be changed. Then return the number of elements in `nums` which are not equal to `val`.

### Example

```
Input: nums = [3,2,2,3], val = 3
Output: 2, nums = [2,2,_,_]
Explanation: Your function should return k = 2, with the first two elements of nums being 2.
It does not matter what you leave beyond the returned k (hence they are underscores).
```

## Approach

The brute-force approach for removing elements would be to filter the array with something like `[x for x in nums if x != val]`, although that would result in `O(n)` time and `O(n)` space and is not an in place algorithm.

A better approach (within the bounds of the problem) is to use a two pointer technique. We can have an insertion pointer (starting at index 0), writing to it and increment it when we find a value that does not match `val`.

This solution runs in `O(n)` time with `O(1)` space.

```python
class Solution:
    def removeElement(self, nums: List[int], val: int) -> int:
        insert = 0
        for num in nums:
            if num != val:
                nums[insert] = num
                insert += 1
        return insert
```
