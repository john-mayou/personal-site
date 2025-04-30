## [144. Binary Tree Preorder Traversal](https://leetcode.com/problems/binary-tree-preorder-traversal/description/?envType=problem-list-v2&envId=r27zde7r)

---

Given the `root` of a binary tree, return the preorder traversal of its nodes' values.

### Example

---

```
Input: root = [1,null,2,3]
Output: [1,2,3]
Explanation:
```

![](/content/leetcode/144-binary-tree-preorder-traversal/example-1.png)

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
    def preorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        vals = []
        stack = []
        curr = root

        while curr or stack:
            if curr:
                vals.append(curr.val)
                if curr.right:
                    stack.append(curr.right)
                curr = curr.left
            else:
                curr = stack.pop()

        return vals
```
