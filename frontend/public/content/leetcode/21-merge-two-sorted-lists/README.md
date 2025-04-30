## [21. Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/description/?envType=problem-list-v2&envId=r27zde7r)

---

You are given the heads of two sorted linked lists `list1` and `list2`.

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.

### Example

---

![](/content/leetcode/21-merge-two-sorted-lists/example-1.jpg)

```
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]
```

## Approach

---

### Iterative

---

The easiest way to solve this problem with minimal edge case handling is to start with `dummy` and `curr` (current) pointer that references a single node. We iterate and add a reference to the head of the list with the lowest value to `curr.next` until one list is empty.

When the loop terminates, we know there are remaining nodes in one list, which we can then reference to by assigning `curr.next`. At the end, we still have a reference to the node before the new head (`dummy`), thus we can return `dummy.next`.

This solution runs in `O(n)` time with `O(1)` space (since we reuse nodes).

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = curr = ListNode()

        while list1 and list2:
            if list1.val <= list2.val:
                curr.next = list1
                list1 = list1.next
            else:
                curr.next = list2
                list2 = list2.next
            curr = curr.next

        curr.next = list1 or list2

        return dummy.next
```

### Recursive

---

The recursive approach is similar as the base case is where only one list has remaining nodes. With this solution, our subproblem is merging the two list minus the node with the lowest value.

This algorithm with run in `O(n)` time with `O(n)` space (from the implicit call stack).

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        if not list1:
            return list2
        elif not list2:
            return list1
        elif list1.val <= list2.val:
            list1.next = self.mergeTwoLists(list1.next, list2)
            return list1
        else:
            list2.next = self.mergeTwoLists(list1, list2.next)
            return list2
```
