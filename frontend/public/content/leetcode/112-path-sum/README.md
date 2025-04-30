## [112. Path Sum](https://leetcode.com/problems/path-sum/description/?envType=problem-list-v2&envId=r27zde7r)

---

Given the `root` of a binary tree and an integer `targetSum`, return `true` if the tree has a root-to-leaf path such that adding up all the values along the path equals `targetSum`.

A leaf is a node with no children.

### Example

---

![](/content/leetcode/112-path-sum/example-1.jpg)

```
Input: root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22
Output: true
Explanation: The root-to-leaf path with the target sum is shown.
```

## Approach

---

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def hasPathSum(self, root: Optional[TreeNode], targetSum: int) -> bool:
        q = deque()

        if root:
            q.append((root, root.val))

        while q:
            node, curr_sum = q.popleft()
            if not node.left and not node.right and curr_sum == targetSum:
                return True
            if node.right:
                q.append((node.right, curr_sum + node.right.val))
            if node.left:
                q.append((node.left, curr_sum + node.left.val))

        return False

```
