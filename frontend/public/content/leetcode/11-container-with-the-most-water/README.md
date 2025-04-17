## [11. Container With Most Water](https://leetcode.com/problems/container-with-most-water/description/)

You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the ith line are `(i, 0)` and `(i, height[i])`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.

### Example

![](/content/leetcode/11-container-with-the-most-water/example-1.jpg)

```
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
Explanation: The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.
```

## Approach

The brute-force approach here would be to find every combination of container endpoints and keep track of the largest. This approach would result in `O(n^2)` time and `O(1)` space, but we can do better.

A better way to solve this would be to use a two pointer technique that runs in linear time. Until our two pointers collide, we determine which endpoint to move based on the height.

The core idea here is that moving the taller endpoint can only hurt us, so we always move the smaller one in hopes of finding a larger area. In the event that they are the same height, it does not matter which one we move.

This solution has a much better `O(n)` time and `O(1)` space, resulting in a faster algorithm.

```python
class Solution:
    def maxArea(self, height: List[int]) -> int:
        largest = 0
        left, right = 0, len(height) - 1
        while left < right:
            area = min(height[left], height[right]) * (right - left)
            largest = max(largest, area)
            if height[left] < height[right]:
                left += 1
            else:
                right -= 1
        return largest
```
