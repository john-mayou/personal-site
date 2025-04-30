## [125. Valid Palindrome](https://leetcode.com/problems/valid-palindrome/description/?envType=problem-list-v2&envId=r27zde7r)

---

A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string `s`, return `true` if it is a palindrome, or `false` otherwise.

### Example

---

```
Input: s = "A man, a plan, a canal: Panama"
Output: true
Explanation: "amanaplanacanalpanama" is a palindrome.
```

## Approach

---

```python
class Solution:
    def isPalindrome(self, s: str) -> bool:
        l, r = 0, len(s) - 1

        def alnum(ch):
            return (
                ord('a') <= ord(ch) <= ord('z') or
                ord('A') <= ord(ch) <= ord('Z') or
                ord('0') <= ord(ch) <= ord('9')
            )

        while l < r:
            while l < r and not alnum(s[l]): l += 1
            while l < r and not alnum(s[r]): r -= 1
            lch = s[l] if s[l].islower() else chr(ord('a') + ord(s[l]) - ord('A'))
            rch = s[r] if s[r].islower() else chr(ord('a') + ord(s[r]) - ord('A'))
            if lch != rch: return False
            l += 1
            r -= 1

        return True
```
