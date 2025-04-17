## [3. Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/description/?envType=problem-list-v2&envId=r27zde7r)

Given a string `s`, find the length of the longest substring without duplicate characters.

### Example

```
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
```

## Approach

The brute-force solution here would be to find every possible substring, determine if it's void of repeating characters and update a `maxLen` variable with the substrings length if so. This solution would result in `O(n^3)` time and `O(n)` space, but we can do better.

Instead, we can use a variable length sliding window technique to improve this. The way it works is to keep track of the current `window`, which is the set of characters between (inclusive) the two pointers (`left` and `right`).

Each iteration, we extend the window by moving the right pointer, and adding the character at that index to the window. In this scenario though, repeating characters are not allowed, thus we have to start removing characters from the window (starting from the `left` pointer) and moving left until the repeated character is gone.

Once we have made sure that the window is valid, we can update the `maxLen` variable with the length of the window. This solution has a much faster `O(n)` time and `O(n)` complexity.

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        window = set()
        maxLen = left = 0
        for right in range(len(s)):
            while s[right] in window:
                window.remove(s[left])
                left += 1
            window.add(s[right])
            maxLen = max(maxLen, right - left + 1)
        return maxLen
```
