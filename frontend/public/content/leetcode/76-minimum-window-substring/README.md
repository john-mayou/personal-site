## [76. Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/description/?envType=problem-list-v2&envId=r27zde7r)

---

Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `""`.

The testcases will be generated such that the answer is unique.

### Example

---

```
Input: s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"
Explanation: The minimum window substring "BANC" includes 'A', 'B', and 'C' from string t.
```

## Approach

---

```python
class Solution:
    def minWindow(self, s: str, t: str) -> str:
        if s == "" or t == "":
            return ""

        need = {}
        for ch in t:
            need[ch] = need.get(ch, 0) + 1

        window = {}
        haveCount, needCount = 0, len(need)

        left = 0
        res = ""
        resLen = float('inf')

        for right in range(len(s)):
            ch = s[right]
            window[ch] = window.get(ch, 0) + 1

            if ch in need and window[ch] == need[ch]:
                haveCount += 1

            while haveCount == needCount:
                windowLen = right - left + 1
                if windowLen < resLen:
                    resLen = windowLen
                    res = s[left:right+1]

                lch = s[left]
                window[lch] -= 1
                if lch in need and window[lch] < need[lch]:
                    haveCount -= 1
                left += 1

        return res
```
