## [13. Roman to Integer](https://leetcode.com/problems/roman-to-integer/description/?envType=problem-list-v2&envId=r27zde7r)

Roman numerals are represented by seven different symbols: `I`, `V`, `X`, `L`, `C`, `D` and `M`.

```
Symbol       Value
I             1
V             5
X             10
L             50
C             100
D             500
M             1000
```

`I` can be placed before `V` (5) and `X` (10) to make 4 and 9.
`X` can be placed before `L` (50) and `C` (100) to make 40 and 90.
`C` can be placed before `D` (500) and `M` (1000) to make 400 and 900.

Given a roman numeral, convert it to an integer.

### Example

```
Input: s = "III"
Output: 3
Explanation: III = 3.
```

## Approach

This problem can be solved in linear time by using a single pointer that advances one or two steps per iteration. The first thing we look for is if the current index has a larger associated value than the next element (if in bounds).

If so, we can calculate the value of those two characters using the logic described in the problem description and increment the pointer two indices. In the other case, it's simple addition to find the numeral value and add it to the `result`.

This solution runs in `O(n)` time with `O(1)` space.

```python
class Solution:
    def romanToInt(self, s: str) -> int:
        values = {
            'I': 1,
            'V': 5,
            'X': 10,
            'L': 50,
            'C': 100,
            'D': 500,
            'M': 1000,
        }

        result = i = 0
        while i < len(s):
            if i + 1 < len(s) and values[s[i]] < values[s[i + 1]]:
                result += values[s[i + 1]] - values[s[i]]
                i += 2
            else:
                result += values[s[i]]
                i += 1
        return result
```
