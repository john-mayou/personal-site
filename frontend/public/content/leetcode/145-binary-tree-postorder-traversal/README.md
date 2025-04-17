## [145. Binary Tree Postorder Traversal](https://leetcode.com/problems/binary-tree-postorder-traversal/?envType=problem-list-v2&envId=r27zde7r)

Given the `root` of a binary tree, return the postorder traversal of its nodes' values.

### Example

```
Input: root = [1,null,2,3]
Output: [3,2,1]
Explanation:
```

![](/content/leetcode/145-binary-tree-postorder-traversal/example-1.png)

## Approach

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def postorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        vals = []
        stack = [(root, False)] # node, visited

        while stack:
            node, visited = stack.pop()
            if not node:
                continue
            if visited:
                vals.append(node.val)
                continue

            stack.append((node, True))
            stack.append((node.right, False))
            stack.append((node.left, False))

        return vals
```
