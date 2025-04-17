## [133. Clone Graph](https://leetcode.com/problems/clone-graph/description/?envType=problem-list-v2&envId=r27zde7r)

Given a reference of a node in a connected undirected graph.

Return a deep copy (clone) of the graph.

Each node in the graph contains a value (`int`) and a list (`List[Node]`) of its neighbors.

```
class Node {
  public int val;
  public List<Node> neighbors;
}
```

### Example

![](/content/leetcode/133-clone-graph/example-1.png)

```
Input: adjList = [[2,4],[1,3],[2,4],[1,3]]
Output: [[2,4],[1,3],[2,4],[1,3]]
Explanation: There are 4 nodes in the graph.
1st node (val = 1)'s neighbors are 2nd node (val = 2) and 4th node (val = 4).
2nd node (val = 2)'s neighbors are 1st node (val = 1) and 3rd node (val = 3).
3rd node (val = 3)'s neighbors are 2nd node (val = 2) and 4th node (val = 4).
4th node (val = 4)'s neighbors are 1st node (val = 1) and 3rd node (val = 3).
```

## Approach

```python
"""
# Definition for a Node.
class Node:
    def __init__(self, val = 0, neighbors = None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []
"""

from typing import Optional
class Solution:
    def cloneGraph(self, node: Optional['Node']) -> Optional['Node']:
        if not node:
            return node

        nodes = {} # old to new
        nodes[node] = Node(node.val)
        q = deque()
        q.append(node)

        while q:
            for _ in range(len(q)):
                curr = q.popleft()
                for nei in curr.neighbors:
                    if nei not in nodes:
                        nodes[nei] = Node(nei.val)
                        q.append(nei)
                    nodes[curr].neighbors.append(nodes[nei])

        return nodes[node]
```
