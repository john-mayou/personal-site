## [146. LRU Cache](https://leetcode.com/problems/lru-cache/description/?envType=problem-list-v2&envId=r27zde7r)

---

Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the `LRUCache` class:

- `LRUCache(int capacity)` Initialize the LRU cache with positive size `capacity`.
- `int get(int key)` Return the value of the `key` if the key exists, otherwise return `-1`.
- `void put(int key, int value)` Update the value of the key if the `key` exists. Otherwise, add the `key-value` pair to the cache. If the number of keys exceeds the `capacity` from this operation, evict the least recently used key.

The functions `get` and `put` must each run in `O(1)` average time complexity.

### Example

---

```
Input
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
Output
[null, null, null, 1, null, -1, null, -1, 3, 4]

Explanation
LRUCache lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // cache is {1=1}
lRUCache.put(2, 2); // cache is {1=1, 2=2}
lRUCache.get(1);    // return 1
lRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}
lRUCache.get(2);    // returns -1 (not found)
lRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}
lRUCache.get(1);    // return -1 (not found)
lRUCache.get(3);    // return 3
lRUCache.get(4);    // return 4
```

## Approach

---

```python
class Node:
    def __init__(self, key, val):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:

    def __init__(self, capacity: int):
        self.cache = {} # cache key to node
        self.capacity = capacity

        # head=least recent, tail=most recent
        self.ru_head = Node(0, 0)
        self.ru_tail = Node(0, 0)
        self.ru_head.next = self.ru_tail
        self.ru_tail.prev = self.ru_head

    def _ru_insert(self, node: Node) -> None:
        pred, succ = self.ru_tail.prev, self.ru_tail
        node.prev = pred
        node.next = succ
        pred.next = node
        succ.prev = node

    def _ru_remove(self, node: Node) -> None:
        pred, succ = node.prev, node.next
        pred.next = succ
        succ.prev = pred

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1

        node = self.cache[key]
        self._ru_remove(node)
        self._ru_insert(node)
        return node.val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._ru_remove(self.cache[key])
        node = Node(key, value)
        self.cache[key] = node
        self._ru_insert(node)

        if len(self.cache) > self.capacity:
            lru = self.ru_head.next
            self._ru_remove(lru)
            del self.cache[lru.key]

# Your LRUCache object will be instantiated and called as such:
# obj = LRUCache(capacity)
# param_1 = obj.get(key)
# obj.put(key,value)
```
