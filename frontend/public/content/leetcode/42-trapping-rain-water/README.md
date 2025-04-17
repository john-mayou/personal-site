## [42. Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/description/?envType=problem-list-v2&envId=r27zde7r)

Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.

### Example

![](/content/leetcode/42-trapping-rain-water/example-1.png)

```
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
Explanation: The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.
```

## Approach

```python
class Solution:
    def trap(self, height: List[int]) -> int:
        n = len(height)
        if n <= 2:
            return 0

        # find left max per element
        leftMax: list[int] = [0] * n
        leftMax[0] = 0
        for i in range(1, n):
            leftMax[i] = max(height[i - 1], leftMax[i - 1])

        # find right max per element
        rightMax: list[int] = [0] * n
        rightMax[-1] = 0
        for i in range(n - 2, -1, -1):
            rightMax[i] = max(height[i + 1], rightMax[i + 1])

        water = 0
        for i in range(n):
            water += max(0, min(rightMax[i], leftMax[i]) - height[i])
        return water
```
