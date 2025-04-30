## [94. Binary Tree Inorder Traversal](https://leetcode.com/problems/binary-tree-inorder-traversal/description/?envType=problem-list-v2&envId=r27zde7r)

---

Given the `root` of a binary tree, return the inorder traversal of its nodes' values.

### Example

---

```
Input: root = [1,null,2,3]
Output: [1,3,2]
Explanation:
```

![](/content/leetcode/94-binary-tree-inorder-traversal/example-1.png)

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
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        vals = []
        stack = []
        curr = root

        while curr or stack:
            if curr:
                stack.append(curr)
                curr = curr.left
            else:
                curr = stack.pop()
                vals.append(curr.val)
                curr = curr.right

        return vals
```
