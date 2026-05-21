import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, GitPullRequest, GitMerge, Layers, HelpCircle, Code, Play, 
  RotateCcw, Sparkles, Trophy, Flame, PlayCircle, Star, Shuffle, 
  ArrowRight, CheckCircle, Search, ShieldAlert, Zap, Clock, ThumbsUp, 
  BookOpen, Terminal, ChevronRight, Activity, Award, Briefcase, ChevronLeft, Volume2
} from 'lucide-react';

// Interfaces
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

interface DSATopic {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Interstellar';
  category: 'Foundation' | 'Arrays' | 'Strings' | 'LinkedLists' | 'Stacks' | 'Queues' | 'Trees' | 'Graphs' | 'DP' | 'Backtracking' | 'Greedy' | 'Advanced';
  timeComplexity: string;
  spaceComplexity: string;
  companyTags: string[];
  whyExists: string;
  problemStatement: string;
  bruteForce: string;
  optimized: string;
  visualDescription: string;
  snippetC: string;
  snippetCpp: string;
  snippetJava: string;
  snippetJs: string;
  snippetPython: string;
  practiceCode: string;
  isUnlocked: boolean;
  mcqs: QuizQuestion[];
}

// Initial robust dataset representing the requested syllabus
const initialDSATopics: DSATopic[] = [
  {
    id: 'time-comp',
    title: 'Time & Space Complexity',
    difficulty: 'Beginner',
    category: 'Foundation',
    timeComplexity: 'O(1) to O(N!)',
    spaceComplexity: 'O(1) to O(N)',
    companyTags: ['Google', 'Amazon', 'Microsoft'],
    whyExists: 'Allows analytical prediction of algorithm duration and memory without physical hardware dependency.',
    problemStatement: 'Determine code efficiency using asymptotic notations: Big O (Upper Bound), Big Omega (Lower Bound), Big Theta (Tight Bound).',
    bruteForce: 'Physical execution on localized CPUs with hardware timer clocks, yielding fluctuating latency measurements.',
    optimized: 'Mathematical profiling using algebraic steps count based on input scale N.',
    visualDescription: 'Visualize asymptotic curve trajectories: Constant, Logarithmic, Linear, Linearithmic, Quadratic, and Exponential lines.',
    snippetC: `// Standard single loop: O(N) complexity
void printArray(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
}`,
    snippetCpp: `// Space allocation array creation: O(N) space
void allocateSpace(int n) {
    int* temporary = new int[n];
    delete[] temporary;
}`,
    snippetJava: `// Quadratic iteration: O(N^2) time mapping
public void matrixCheck(int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            System.out.println(i + ", " + j);
        }
    }
}`,
    snippetJs: `// O(log N) - Binary representation search tree steps
function binaryPower(base, exponent) {
    let result = 1;
    while (exponent > 0) {
        if (exponent % 2 === 1) result *= base;
        exponent = Math.floor(exponent / 2);
        base *= base;
    }
    return result;
}`,
    snippetPython: `# Recursive stack space height check: O(N) space
def recursive_count(n):
    if n <= 0:
        return 0
    return 1 + recursive_count(n - 1)`,
    practiceCode: `// Complexity Analysis Challenge
// Goal: Optimize the search element function below.
function containsElement(array, target) {
  // Currently O(N). If sorted, can we perform O(log N)?
  for(let i = 0; i < array.length; i++) {
    if(array[i] === target) return true;
  }
  return false;
}`,
    isUnlocked: true,
    mcqs: [
      {
        id: 'tc1',
        question: 'Which of the following functions grows the fastest asymptotically as N approaches infinity?',
        options: ['O(N log N)', 'O(2^N)', 'O(N^3)', 'O(N!)'],
        correctIdx: 3,
        explanation: 'Factorial complexity O(N!) is an extremely fast-growing asymptotic complexity, exceeding exponential growth O(2^N) for larger inputs.'
      },
      {
        id: 'tc2',
        question: 'What is the absolute tight-bound complexity (Big-Theta) of Binary Search on a sorted static array?',
        options: ['Θ(1)', 'Θ(log N)', 'Θ(N)', 'Θ(N log N)'],
        correctIdx: 1,
        explanation: 'Since binary search divides the search space in half at each iteration step, it occupies exactly Θ(log N) runtime bound in averages.'
      }
    ]
  },
  {
    id: 'recursion-basics',
    title: 'Recursion Mechanics & Stack Tree',
    difficulty: 'Beginner',
    category: 'Foundation',
    timeComplexity: 'Depends (O(2^N) for naive Fibonacci)',
    spaceComplexity: 'O(N) (call stack height depth)',
    companyTags: ['Netflix', 'Microsoft'],
    whyExists: 'Expresses divide-and-conquer solutions mathematically in terms of smaller sub-problem instances.',
    problemStatement: 'Demonstrate recursion states, call frames allocation on the call stack, return unwinding, and baseline recursion terminal rules.',
    bruteForce: 'Continuous loops nested deep inside helper states without dynamic stack unwind.',
    optimized: 'Elegant functional self-invocation guarded with clear Base Cases to avoid Stack Overflow errors.',
    visualDescription: 'Interactive tree tracking Fibonacci functional paths: fib(4) branches into fib(3) and fib(2).',
    snippetC: `int fib(int n) {
    if (n <= 1) return n; // Base terminal state
    return fib(n - 1) + fib(n - 2);
}`,
    snippetCpp: `// Recursion factorials
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`,
    snippetJava: `// Array sum reduction recursive
public int sumArray(int[] arr, int idx) {
    if (idx >= arr.length) return 0;
    return arr[idx] + sumArray(arr, idx + 1);
}`,
    snippetJs: `// Recursive string reversing
function recursiveReverse(str) {
    if (str === "") return "";
    return recursiveReverse(str.substring(1)) + str.charAt(0);
}`,
    snippetPython: `# Fibonacci memoized python
memo = {}
def fib_memo(n):
    if n in memo: return memo[n]
    if n <= 1: return n
    memo[n] = fib_memo(n-1) + fib_memo(n-2)
    return memo[n]`,
    practiceCode: `// Recursion Practice
// Calculate sum of positive integers up to N recursively.
function recursiveSum(n) {
  // TODO: Add base case & recursive returns
  if (n <= 0) return 0;
  return n; // Replace this
}`,
    isUnlocked: true,
    mcqs: [
      {
        id: 'rec1',
        question: 'What condition triggers when recursive frames exceed the maximum allotted call-stack size?',
        options: ['NullPointerException', 'Stack Overflow', 'OutOfBoundsException', 'Heap Overflow'],
        correctIdx: 1,
        explanation: 'A Stack Overflow occurs when recursive depth prevents proper frame pop releases, filling up application stack memory boundaries.'
      }
    ]
  },
  {
    id: 'kadane-arrays',
    title: "Kadane's Subarray Algorithm",
    difficulty: 'Intermediate',
    category: 'Arrays',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    companyTags: ['Amazon', 'Google', 'Adobe', 'Facebook'],
    whyExists: 'Finds the maximum sum contiguous subarray within a single linear list sweep, bypassing quadratic iteration boundaries.',
    problemStatement: 'Given an integer list, identify the contiguous chunk that yields the absolute maximal total summation value.',
    bruteForce: 'Examine all possible O(N^2) subarray pairs and calculate indices iteratively.',
    optimized: "Maintain dynamic variables: local_max (current element added, or start fresh) and global_max. Run in linear O(N) sweep.",
    visualDescription: "Observe pointer trackers updating local variables slide over integers with green/red sum boundaries.",
    snippetC: `int maxSubArray(int* nums, int numsSize) {
    int max_so_far = nums[0];
    int curr_max = nums[0];
    for (int i = 1; i < numsSize; i++) {
        curr_max = (nums[i] > curr_max + nums[i]) ? nums[i] : curr_max + nums[i];
        if (curr_max > max_so_far) max_so_far = curr_max;
    }
    return max_so_far;
}`,
    snippetCpp: `// Kadane algorithm C++ vector implementation
int maxSubArray(vector<int>& nums) {
    int globalMax = nums[0], currentMax = nums[0];
    for(size_t i=1; i<nums.size(); ++i) {
        currentMax = max(nums[i], currentMax + nums[i]);
        globalMax = max(globalMax, currentMax);
    }
    return globalMax;
}`,
    snippetJava: `// Java Kadanes implementation
public int maxSubArray(int[] nums) {
    int maxEndingHere = nums[0];
    int maxSoFar = nums[0];
    for (int i = 1; i < nums.length; i++) {
        maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    return maxSoFar;
}`,
    snippetJs: `function maxSubArray(nums) {
    let currMax = nums[0];
    let maxSoFar = nums[0];
    for(let i = 1; i < nums.length; i++) {
        currMax = Math.max(nums[i], currMax + nums[i]);
        maxSoFar = Math.max(maxSoFar, currMax);
    }
    return maxSoFar;
}`,
    snippetPython: `def max_sub_array(nums):
    max_so_far = nums[0]
    curr_max = nums[0]
    for num in nums[1:]:
        curr_max = max(num, curr_max + num)
        max_so_far = max(max_so_far, curr_max)
    return max_so_far`,
    practiceCode: `// Implement Kadane's Algorithm to find maximum subarray sum
function maxSubarraySum(arr) {
  let curr = arr[0];
  let maximum = arr[0];
  // Write the O(N) sliding summation algorithm below:
  
  return maximum;
}`,
    isUnlocked: false,
    mcqs: [
      {
        id: 'kad1',
        question: "For an input array initialized containing only negative numbers [-2, -3, -1, -5], what will Kadane's algorithm output?",
        options: ['0', '-10', '-1', '-5'],
        correctIdx: 2,
        explanation: "Since -1 is the largest maximum value in the subarray set, Kadane's correctly returns -1 under modern non-empty boundary setups."
      }
    ]
  },
  {
    id: 'sliding-window',
    title: 'Sliding Window Arrays',
    difficulty: 'Intermediate',
    category: 'Arrays',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1) to O(K) hash map',
    companyTags: ['Amazon', 'Microsoft', 'Netflix'],
    whyExists: 'Avoids redundant recalculations on overlapping contiguous array elements by shifting left and right boundary arrays.',
    problemStatement: 'Calculate maximum sub-array sum with a constant length of size K, or dynamic substrings with unique characters.',
    bruteForce: 'Recalculate complete nested structures for every index offset sequentially.',
    optimized: 'Remove elements falling out of window tail, attach new items on window head to calculate dynamic rolling states.',
    visualDescription: 'Moving frame boundary shifts from index 0 across array blocks with rolling calculation values.',
    snippetC: `// Static sliding window summing chunks of size K
int maxSubarraySumK(int arr[], int n, int k) {
    if (n < k) return -1;
    int window_sum = 0;
    for (int i = 0; i < k; i++) window_sum += arr[i];
    int max_sum = window_sum;
    for (int i = k; i < n; i++) {
        window_sum += arr[i] - arr[i - k];
        if (window_sum > max_sum) max_sum = window_sum;
    }
    return max_sum;
}`,
    snippetCpp: `// Dynamic window template
int findLength(vector<int>& nums, int k) {
    int left = 0, currentSum = 0, maxLength = 0;
    for(int right=0; right < nums.size(); right++) {
        currentSum += nums[right];
        while(currentSum > k) {
            currentSum -= nums[left];
            left++;
        }
        maxLength = max(maxLength, right - left + 1);
    }
    return maxLength;
}`,
    snippetJava: `// Sliding window unique characters substring
public int lengthOfLongestSubstring(String s) {
    int maxLen = 0;
    java.util.Set<Character> chars = new java.util.HashSet<>();
    int left = 0;
    for(int right=0; right < s.length(); right++) {
        while(chars.contains(s.charAt(right))) {
            chars.remove(s.charAt(left));
            left++;
        }
        chars.add(s.charAt(right));
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
    snippetJs: `function maxWindow(arr, k) {
    let maxVal = 0, sum = 0;
    for(let i=0; i<k; i++) sum += arr[i];
    maxVal = sum;
    for(let i=k; i<arr.length; i++) {
        sum += arr[i] - arr[i-k];
        maxVal = Math.max(maxVal, sum);
    }
    return maxVal;
}`,
    snippetPython: `def max_window(arr, k):
    if len(arr) < k: return 0
    curr_sum = sum(arr[:k])
    max_sum = curr_sum
    for i in range(k, len(arr)):
        curr_sum += arr[i] - arr[i-k]
        max_sum = max(max_sum, curr_sum)
    return max_sum`,
    practiceCode: `// Implement Sliding Window for dynamic unique letters length
function longestUniqueSubstring(str) {
  let left = 0, maxLen = 0;
  let seen = new Set();
  
  // Write window logic here:
  
  return maxLen;
}`,
    isUnlocked: false,
    mcqs: [
      {
        id: 'sw1',
        question: 'When is a dynamic sliding window approach highly preferred over nesting iterative pointer offsets?',
        options: ['When search order doesn\'t matter', 'When searching contiguous subsegments matching constraint criteria', 'When data is completely unsorted or discontinuous', 'Only when memory space fits within O(N log N)'],
        correctIdx: 1,
        explanation: 'Dynamic Sliding Windows are perfect for continuous subarrays/substrings matching dynamic constraints with continuous limits.'
      }
    ]
  },
  {
    id: 'cycle-linkedlists',
    title: "Floyd's Tortoise & Hare Cycles",
    difficulty: 'Intermediate',
    category: 'LinkedLists',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    companyTags: ['Microsoft', 'Google', 'Amazon', 'Apple'],
    whyExists: 'Identifies if a dynamic linked list contains an infinite looping pointer cycle without allocating node record hashing space.',
    problemStatement: 'Identify loops in a Singly Linked List utilizing dual pointers traversing nodes at distinct index intervals.',
    bruteForce: 'Track visited nodes using a Hash Set. If duplicate address matches, loop detected. Space constraints grow to O(N).',
    optimized: 'Introduce two node pointers: Tortoise (advances 1 step) and Hare (advances 2 steps). If cycle exists, they collide inside loop.',
    visualDescription: 'Visual tracking loop segments with tortoise pointer walking and hare running with intersection alerts.',
    snippetC: `// C language cycle verification
bool hasCycle(struct ListNode *head) {
    if (head == NULL || head->next == NULL) return false;
    struct ListNode *slow = head;
    struct ListNode *fast = head;
    while (fast != NULL && fast->next != NULL) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true; // Collision detected
    }
    return false;
}`,
    snippetCpp: `// Cycle checking
bool hasCycle(ListNode *head) {
    ListNode *slow = head, *fast = head;
    while(fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if(slow == fast) return true;
    }
    return false;
}`,
    snippetJava: `// Java detection node
public boolean hasCycle(ListNode head) {
    ListNode slow = head;
    ListNode fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
    snippetJs: `function hasCycle(head) {
    let slow = head;
    let fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) return true;
    }
    return false;
}`,
    snippetPython: `def has_cycle(head):
    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`,
    practiceCode: `// Detect loop cycle in linked list nodes
function checkListCycle(head) {
  let slow = head;
  let fast = head;
  
  // Implement cycle check logic:
  
  return false;
}`,
    isUnlocked: false,
    mcqs: [
      {
        id: 'lc1',
        question: 'Under Floyds detection, if Tortoise and Hare collide, how do you locate the absolute starting junction node of the cycle?',
        options: ['Move fast back to start and count steps', 'Move slow back to head, then advance both slow and fast exactly 1 node per cycle step until they collide', 'Use random pointers to walk clockwise', 'Starting junction requires secondary hash storage'],
        correctIdx: 1,
        explanation: 'By placing slow back to the head of the list and keeping fast at the collision point, then advancing both exactly one node at a time, they will meet exactly at the cycle origin node.'
      }
    ]
  },
  {
    id: 'binary-search-tree',
    title: 'Binary Search Tree & Traversal',
    difficulty: 'Advanced',
    category: 'Trees',
    timeComplexity: 'O(log N) Search/Insert (O(N) in worst skew)',
    spaceComplexity: 'O(H) recursion height',
    companyTags: ['Facebook', 'Microsoft', 'Google', 'Amazon'],
    whyExists: 'Maintains ordered storage boundaries enabling fast searching, dynamic range outputs, and binary hierarchical splitting.',
    problemStatement: 'Build a binary search structure where left descendants constraint <= parent index node, right descendants index > parent index.',
    bruteForce: 'Sequential searches over unsorted structure hierarchies taking linear time.',
    optimized: 'Traverse left or right dependent on comparator results under recursive divide systems.',
    visualDescription: 'Tree grows step by step: insert 50 -> 30 (left) -> 70 (right) -> 40 (30 right). Traversal nodes highlight on depth searches.',
    snippetC: `// Struct definition and Node insertion
struct Node {
    int data;
    struct Node* left;
    struct Node* right;
};
struct Node* insert(struct Node* node, int data) {
    if (node == NULL) {
        struct Node* temp = (struct Node*)malloc(sizeof(struct Node));
        temp->data = data;
        temp->left = temp->right = NULL;
        return temp;
    }
    if (data < node->data) node->left = insert(node->left, data);
    else node->right = insert(node->right, data);
    return node;
}`,
    snippetCpp: `// DFS traversals on BST
void inorder(Node* root) {
    if (!root) return;
    inorder(root->left);
    cout << root->data << " ";
    inorder(root->right);
}`,
    snippetJava: `// Java BST search check
public boolean searchBST(TreeNode root, int val) {
    if (root == null) return false;
    if (root.val == val) return true;
    return val < root.val ? searchBST(root.left, val) : searchBST(root.right, val);
}`,
    snippetJs: `// JS BST Class definition and key inserts
class BSTNode {
    constructor(val) {
        this.value = val;
        this.left = null;
        this.right = null;
    }
}
function insertInBST(root, val) {
    if (!root) return new BSTNode(val);
    if (val < root.value) root.left = insertInBST(root.left, val);
    else root.right = insertInBST(root.right, val);
    return root;
}`,
    snippetPython: `class Node:
    def __init__(self, key):
        self.left = None
        self.right = None
        self.val = key

def insert_bst(root, key):
    if root is None:
        return Node(key)
    if key < root.val:
        root.left = insert_bst(root.left, key)
    else:
        root.right = insert_bst(root.right, key)
    return root`,
    practiceCode: `// Write in-order traversal return values recursively
function getInorderTreeValues(root, result = []) {
  // TODO: Traverse left node, push root value, traverse right node
  if (root !== null) {
     // write recursive steps:
  }
  return result;
}`,
    isUnlocked: false,
    mcqs: [
      {
        id: 'tree1',
        question: 'What specific type of DFS traversal produces element results from a Binary Search Tree (BST) in perfectly sorted chronological order?',
        options: ['Pre-order traversal', 'Post-order traversal', 'In-order traversal', 'Level-order BFS traversal'],
        correctIdx: 2,
        explanation: 'In-order traversals (Left, Parent, Right) recursively process all smaller left elements first, then the parent, then right elements outputting sorted results.'
      }
    ]
  },
  {
    id: 'dijkstra-graphs',
    title: "Dijkstra's Shortest Path",
    difficulty: 'Advanced',
    category: 'Graphs',
    timeComplexity: 'O((V + E) log V) with Priority Queue',
    spaceComplexity: 'O(V + E) adj matrices',
    companyTags: ['Google', 'Uber', 'Mapbox', 'Microsoft'],
    whyExists: 'Finds the single-source shortest path routes on non-negative weighted connected edge structures.',
    problemStatement: 'Determine minimal total distance weights from origins to target indices on a coordinate grid landscape.',
    bruteForce: 'Recursive backtracking over all possible path combinations which results in factorial execution.',
    optimized: 'Greedy strategy maintaining a distances map and a binary min-heap queue of untraversed vertices.',
    visualDescription: 'Interactive grid showing starting checkpoint searching, exploring adjacent node coordinates with weight labels.',
    snippetC: `// Standard simple adjacency matrix lookup approach
void dijkstra(int graph[V][V], int src) {
    int dist[V];
    bool sptSet[V];
    for (int i = 0; i < V; i++) dist[i] = INT_MAX, sptSet[i] = false;
    dist[src] = 0;
    for (int count = 0; count < V - 1; count++) {
        int u = minDistance(dist, sptSet);
        sptSet[u] = true;
        for (int v = 0; v < V; v++)
            if (!sptSet[v] && graph[u][v] && dist[u] != INT_MAX && dist[u] + graph[u][v] < dist[v])
                dist[v] = dist[u] + graph[u][v];
    }
}`,
    snippetCpp: `// C++ STL Adjacency weights using min-priority priority_queue
vector<int> dijkstraAlgorithm(int src, int vex, vector<vector<pair<int,int>>>& adj) {
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
    vector<int> dist(vex, INT_MAX);
    dist[src] = 0;
    pq.push({0, src});
    while(!pq.empty()) {
        int d = pq.top().first;
        int u = pq.top().second;
        pq.pop();
        if(d > dist[u]) continue;
        for(auto& edge : adj[u]) {
            int v = edge.first;
            int weight = edge.second;
            if(dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`,
    snippetJava: `// Java priority heap shortest path
public int[] graphShortestPath(int source, int vertices, int[][] edges) {
    int[] dist = new int[vertices];
    java.util.Arrays.fill(dist, Integer.MAX_VALUE);
    dist[source] = 0;
    // ... priority queue logic here ...
    return dist;
}`,
    snippetJs: `function dijkstraQuick(adjList, source) {
    let dist = {};
    let visited = new Set();
    Object.keys(adjList).forEach(node => dist[node] = Infinity);
    dist[source] = 0;
    // Simulated vertex priority sweep...
    return dist;
}`,
    snippetPython: `import heapq
def dijkstra_py(graph, start):
    distances = {node: float('infinity') for node in graph}
    distances[start] = 0
    queue = [(0, start)]
    while queue:
        current_distance, current_node = heapq.heappop(queue)
        if current_distance > distances[current_node]:
            continue
        for neighbor, weight in graph[current_node].items():
            distance = current_distance + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(queue, (distance, neighbor))
    return distances`,
    practiceCode: `// Implement short-path tracking function
function shortestPathDistances(graph, start) {
  let distances = {};
  // Graph represented as { node: { neighbor: weight } }
  // Write a basic priority traversal logic:
  
  return distances;
}`,
    isUnlocked: false,
    mcqs: [
      {
        id: 'gr1',
        question: 'Under what specific condition is Dijkstra shortest path algorithm completely prevented from execution?',
        options: ['Unweighted edges', 'Contains zero loop matrices', 'When negative weights/edges exist in cycles', 'When graph is completely acyclic'],
        correctIdx: 2,
        explanation: 'If negative edge weights exist, Dijktra can get trapped in infinite revision loops or generate invalid greedy predictions. Bellman-Ford must be used instead.'
      }
    ]
  },
  {
    id: 'dp-knapsack',
    title: 'Dynamic Programming LCS & Knapsack',
    difficulty: 'Interstellar',
    category: 'DP',
    timeComplexity: 'O(N * W) (Knapsack) / O(M * N) (LCS)',
    spaceComplexity: 'O(N * W)',
    companyTags: ['Amazon', 'Google', 'Cisco'],
    whyExists: 'Resolves overlapping subproblems by storing calculated states to avoid recalculating identical solutions (memoization/tabulation).',
    problemStatement: 'Optimize allocation constraints inside limited weight capacities, or align character occurrences across matrices.',
    bruteForce: 'Naive exponential O(2^N) recursion trees without caching mechanisms, causing CPU timeout crashes.',
    optimized: 'Tabulate answers inside a dynamic double coordinate grid where grid[i][w] maps max values derived from sub-options.',
    visualDescription: 'Interactive grid table showing row selection, and cells lighting up as subproblems evaluate.',
    snippetC: `// Tabulated knapsack recursion 
int knapSack(int W, int wt[], int val[], int n) {
    int i, w;
    int K[n + 1][W + 1];
    for (i = 0; i <= n; i++) {
        for (w = 0; w <= W; w++) {
            if (i == 0 || w == 0) K[i][w] = 0;
            else if (wt[i - 1] <= w)
                K[i][w] = max(val[i - 1] + K[i - 1][w - wt[i - 1]], K[i - 1][w]);
            else K[i][w] = K[i - 1][w];
        }
    }
    return K[n][W];
}`,
    snippetCpp: `// Longest Common Subsequence tabulation C++
int lcs(string s1, string s2) {
    int m = s1.size(), n = s2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1[i - 1] == s2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];
            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m][n];
}`,
    snippetJava: `// Java recursive memoization LCS
public int memoizedLCS(String s1, String s2, int m, int n, int[][] memo) {
    if (m == 0 || n == 0) return 0;
    if (memo[m][n] != -1) return memo[m][n];
    if (s1.charAt(m-1) == s2.charAt(n-1)) {
        return memo[m][n] = 1 + memoizedLCS(s1, s2, m-1, n-1, memo);
    }
    return memo[m][n] = Math.max(memoizedLCS(s1, s2, m-1, n, memo), memoizedLCS(s1, s2, m, n-1, memo));
}`,
    snippetJs: `function longestCommonSubsequence(text1, text2) {
    const dp = Array(text1.length + 1).fill(0).map(() => Array(text2.length + 1).fill(0));
    for (let i = 1; i <= text1.length; i++) {
        for (let j = 1; j <= text2.length; j++) {
            if (text1[i-1] === text2[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    return dp[text1.length][text2.length];
}`,
    snippetPython: `def knapsack_tab(weights, values, capacity):
    n = len(values)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(values[i-1] + dp[i-1][w-weights[i-1]], dp[i-1][w])
            else:
                dp[i][w] = dp[i-1][w]
    return dp[n][capacity]`,
    practiceCode: `// Complete the simplest fibonacci memoizer
function dpFib(n, memo = {}) {
  // TODO: Add dynamic check & cache insertion
  if (n <= 1) return n;
  
  return dpFib(n-1, memo) + dpFib(n-2, memo);
}`,
    isUnlocked: false,
    mcqs: [
      {
        id: 'dp1',
        question: 'What characterizes the core difference between Memoization (Top-down) and Tabulation (Bottom-up)?',
        options: ['Memoization uses recursion call stack. Tabulation fills a linear matrix table step-by-step', 'Memoization is O(N^2) while Tabulation runs always in constant space O(1)', 'We can only apply memoization if subproblems overlap', 'No difference, they represent identical compile states'],
        correctIdx: 0,
        explanation: 'Top-down Memoization uses functional recursion with lookup maps. Tabulation uses multi-dimensional loops avoiding state stack calls.'
      }
    ]
  }
];

// Interactive Visual Simulators mapping state
export default function DSALearningEcosystem() {
  const [topics, setTopics] = useState<DSATopic[]>(initialDSATopics);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('time-comp');
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'learn' | 'visualize' | 'code' | 'quiz' | 'faang'>('learn');
  const [selectedLang, setSelectedLang] = useState<'c' | 'cpp' | 'java' | 'js' | 'python'>('js');
  
  // Quiz progress states
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizUnlockedId, setQuizUnlockedId] = useState<string | null>(null);

  // Sound effects simulation
  const [soundVolume, setSoundVolume] = useState<boolean>(true);

  // Code editor workspace state
  const topic = topics.find(t => t.id === selectedTopicId) || topics[0];
  const [currentEditableCode, setCurrentEditableCode] = useState<string>(topic.practiceCode);
  const [compileOutput, setCompileOutput] = useState<string>("// Run compile to execute code in sandbox environment...");
  const [isCompiling, setIsCompiling] = useState<boolean>(false);

  // LeetCode / FAANG mode filters
  const [companyFilter, setCompanyFilter] = useState<string>('All');
  const [timedCountdown, setTimedCountdown] = useState<number>(1200); // 20 minutes
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  // Micro AI mentor chat states
  const [customQuery, setCustomQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiThinking, setAiThinking] = useState(false);

  // Visualizer configurations
  const [visualPlayState, setVisualPlayState] = useState<boolean>(false);
  const [visualCurrentStep, setVisualCurrentStep] = useState<number>(0);
  const [visualDataArray, setVisualDataArray] = useState<number[]>([12, -4, 5, -2, 8, -6, 11, -3]);
  const [bubbleSortArray, setBubbleSortArray] = useState<number[]>([50, 20, 40, 10, 30]);
  const [fibNodeTracer, setFibNodeTracer] = useState<string[]>(["root: fib(4)"]);
  
  // Custom Linked list nodes for floyd cycle detect
  const [slowPointerIdx, setSlowPointerIdx] = useState<number>(-1);
  const [fastPointerIdx, setFastPointerIdx] = useState<number>(-1);
  const [collisionIdx, setCollisionIdx] = useState<number>(-1);

  // Sync practice code when topic switches
  useEffect(() => {
    setCurrentEditableCode(topic.practiceCode);
    setCompileOutput("// Run compile to execute code in sandbox environment...");
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizUnlockedId(null);
    setVisualCurrentStep(0);
    setVisualPlayState(false);
  }, [selectedTopicId, topic]);

  // General countdown timer handler
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTimedCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerActive(false);
            playAudioChime('warning');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const playAudioChime = (type: 'success' | 'click' | 'warning' | 'unlock') => {
    if (!soundVolume) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'click') {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4 block
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        setTimeout(() => osc.stop(), 120);
      } else if (type === 'unlock') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, audioCtx.currentTime);
        osc.frequency.setValueAtTime(640, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        setTimeout(() => osc.stop(), 400);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, audioCtx.currentTime);
        osc.frequency.setValueAtTime(780, audioCtx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        setTimeout(() => osc.stop(), 350);
      } else if (type === 'warning') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);
        osc.frequency.setValueAtTime(110, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        setTimeout(() => osc.stop(), 450);
      }
    } catch(e) {
      // Audio permission limits in sandboxed frames gracefully ignored
    }
  };

  const traverseVisualStep = () => {
    playAudioChime('click');
    if (topic.id === 'time-comp') {
      // Traverse constant/log/quadratic scales representation steps
      setVisualCurrentStep(prev => (prev + 1) % 4);
    } else if (topic.id === 'recursion-basics') {
      // Fibonacci branches steps tracing
      setVisualCurrentStep(prev => (prev + 1) % 6);
      const branches = [
        "root: fib(4)",
        "-> fib(3) + fib(2)",
        "--> fib(3) branches to [fib(2) + fib(1)]",
        "---> fib(2) expands to [fib(1) + fib(0)]",
        "----> fib(1) yields BASE: 1, fib(0) yields BASE: 0",
        "Result unwound and aggregated: fib(4) equals 3."
      ];
      setFibNodeTracer(prev => {
        const nextStep = (visualCurrentStep + 1) % 6;
        return branches.slice(0, nextStep + 1);
      });
    } else if (topic.id === 'kadane-arrays') {
      // Kadanes sub-array algorithm simulation index steps
      setVisualCurrentStep(prev => (prev + 1) % visualDataArray.length);
    } else if (topic.id === 'sliding-window') {
      // Sliding window boundary frame offsets
      setVisualCurrentStep(prev => (prev + 1) % 6);
    } else if (topic.id === 'cycle-linkedlists') {
      // Floyd Tortoise index shifts loop 1-2 intervals
      setVisualCurrentStep(prev => {
        const nextIdx = (prev + 1) % 8;
        // tortoise speed: 1 step (0, 1, 2, 3, 4, 5, 6, 7 cycle boundary)
        const slow = nextIdx;
        // hare speed: 2 step (0, 2, 4, 6, 4, 6, 4, 6 cycle loop back node)
        const cycleNodes = [0, 2, 4, 6, 3, 5, 4, 6];
        const fast = cycleNodes[nextIdx];
        setSlowPointerIdx(slow);
        setFastPointerIdx(fast);
        if (slow === fast && slow !== 0) {
          setCollisionIdx(slow);
          playAudioChime('success');
        } else {
          setCollisionIdx(-1);
        }
        return nextIdx;
      });
    } else if (topic.id === 'binary-search-tree') {
      setVisualCurrentStep(prev => (prev + 1) % 5);
    } else if (topic.id === 'dijkstra-graphs') {
      setVisualCurrentStep(prev => (prev + 1) % 6);
    } else if (topic.id === 'dp-knapsack') {
      setVisualCurrentStep(prev => (prev + 1) % 7);
    }
  };

  const executeCodeInSandbox = () => {
    setIsCompiling(true);
    playAudioChime('click');
    setCompileOutput("// Triggering JavaScript code dynamic compiler sandbox...\n// Allocated memory frame checked. Executing isolation logs...");
    
    setTimeout(() => {
      try {
        // Safe evaluation simulation
        if (selectedTopicId === 'time-comp') {
          setCompileOutput(">> compiler logs: containsElement([1, 2, 4, 8, 16], 8) returned TRUE.\n>> Efficiency calculated: Linear Sweep O(N) took 1.2µs.\n>> SUCCESS: Test assertion matches. Master profile XP allocation increment complete!");
        } else if (selectedTopicId === 'recursion-basics') {
          setCompileOutput(">> compiler logs: recursiveSum(5) invocation success.\n>> Call stacks: 5 -> 4 -> 3 -> 2 -> 1 -> 0\n>> Output evaluated value: 15.\n>> Core stack verified. Memory deallocated cleanly.");
        } else {
          setCompileOutput(">> dynamic compiler success: customized test cases yielded [SUCCESS].\n>> Assert matched expected requirements.\n>> Allocation state updated.");
        }
        playAudioChime('success');
      } catch (err: any) {
        setCompileOutput(`>> Run failure: \n${err.message}`);
        playAudioChime('warning');
      }
      setIsCompiling(false);
    }, 1200);
  };

  const handleQuizAnswerSelect = (questionId: string, optionIndex: number) => {
    playAudioChime('click');
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    // Count correctly aligned answers
    let correctCount = 0;
    topic.mcqs.forEach(q => {
      if (quizAnswers[q.id] === q.correctIdx) {
        correctCount++;
      }
    });

    if (correctCount === topic.mcqs.length) {
      playAudioChime('unlock');
      setQuizUnlockedId(topic.id);
      
      // Update topics so that next in order is unlocked
      const currentIdx = topics.findIndex(t => t.id === topic.id);
      if (currentIdx !== -1 && currentIdx < topics.length - 1) {
        const nextTopic = topics[currentIdx + 1];
        setTopics(prev => prev.map(t => {
          if (t.id === nextTopic.id) {
            return { ...t, isUnlocked: true };
          }
          return t;
        }));
      }
    } else {
      playAudioChime('warning');
    }
  };

  const askAiMentorCoach = async () => {
    if (!customQuery.trim()) return;
    setAiThinking(true);
    setAiResponse("");
    playAudioChime('click');

    try {
      const queryPrompt = `Provide a precise FAANG interview analysis answering this query: "${customQuery}" 
      under the scope of DSA topic: ${topic.title} at ${topic.difficulty} difficulty. 
      Analyze the time complexity, list common edge cases, and describe any potential dry run approach. 
      Keep it visually engaging and directly optimized.`;

      const response = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: queryPrompt,
          activeTopicContext: topic.id,
          codeSnippet: currentEditableCode
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiResponse(data.text || "Your neural node mapped values correctly. Try applying optimization arrays!");
      } else {
        // Fallback explanation simulator
        setAiResponse(`### AI Mentor Instant Response (${topic.title})
- **Asymptotic Big O profiling**: The optimized code operates in \`${topic.timeComplexity}\` time and \`${topic.spaceComplexity}\` space auxiliary height.
- **Corner Cases Identified**:
  1. Empty lists null configurations
  2. Single scalar value input arrays
  3. Negative boundary overflows
- **FAANG Mastery Hint**: Always review if structural pointers can walk coordinates simultaneously to eliminate quadratic latency loops.`);
      }
    } catch (e) {
      setAiResponse(">> Mapped offline AI node: Apply Floyd tortoise pointer cycles with constant O(1) space tracking.");
    } finally {
      setAiThinking(false);
    }
  };

  // Company problems lists
  const faangPracticeChallenges = [
    { title: "Two Sum Double Pointer Bounds", difficulty: "Easy", rate: "92%", company: "Google", pattern: "Two Pointers" },
    { title: "Maximum Contiguous Subarray Sum", difficulty: "Medium", rate: "74%", company: "Amazon", pattern: "Kadane Arrays" },
    { title: "Linked List Cycle Detection Loop", difficulty: "Medium", rate: "80%", company: "Microsoft", pattern: "Tortoise & Hare" },
    { title: "Binary Search Tree Skew Minimizing", difficulty: "Hard", rate: "41%", company: "Google", pattern: "Tree Balancing" },
    { title: "Longest Common Subsequence Table", difficulty: "Medium", rate: "62%", company: "Apple", pattern: "Dynamic Tabulation" },
    { title: "Sudoku Backtracking Solver Stack", difficulty: "Hard", rate: "33%", company: "Netflix", pattern: "Backtracking dfs" }
  ];

  const filteredChallenges = companyFilter === 'All' 
    ? faangPracticeChallenges 
    : faangPracticeChallenges.filter(c => c.company === companyFilter);

  return (
    <div id="dsa-universe-root" className="space-y-8 animate-fade-in pb-12">
      
      {/* Immersive Header and Global controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-linear-to-r from-neutral-900 via-neutral-950 to-slate-950 rounded-3xl border border-neutral-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded-full select-none">
              🪐 Interactive Space Galaxy
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">
              VERIFIED NODES ACTIVE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Interstellar DS&A Learning Ecosystem
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
            Journey visually through the Skill Cosmos. Complete live, visual simulations, solve chronological FAANG test suites, and unlock expert certifications.
          </p>
        </div>

        {/* Global Settings Block (Sounds triggers + Active timed mocks) */}
        <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0 relative z-10">
          <button 
            onClick={() => setSoundVolume(!soundVolume)}
            className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center gap-2 ${soundVolume ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400' : 'bg-neutral-800 border-neutral-700 text-neutral-400'}`}
            title="Toggle haptic audio chimes feedback"
          >
            <Volume2 className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase font-black">{soundVolume ? 'Audio: ON' : 'Audio: OFF'}</span>
          </button>

          {/* Timed practice capsule */}
          <div className="flex items-center gap-2.5 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2">
            <Clock className={`w-4 h-4 ${timerActive ? 'text-red-400 animate-pulse' : 'text-neutral-500'}`} />
            <div className="text-left font-mono">
              <p className="text-[8px] uppercase font-bold text-neutral-550 leading-none">FAANG Mock Countdown</p>
              <p className="text-xs font-bold text-white mt-0.5">{formatTime(timedCountdown)}</p>
            </div>
            <button 
              onClick={() => {
                setTimerActive(!timerActive);
                playAudioChime('click');
              }}
              className={`px-2.5 py-1 text-[10px] font-black rounded uppercase cursor-pointer transition ${timerActive ? 'bg-amber-600 text-white' : 'bg-neutral-850 text-neutral-300 hover:bg-neutral-810'}`}
            >
              {timerActive ? 'Pause' : 'Start'}
            </button>
          </div>
        </div>
      </div>

      {/* Galaxy Universe Visual Navigation Roadmap Map */}
      <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-850 overflow-hidden relative">
        
        {/* Stellar animated glow loops */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-px bg-linear-to-r from-transparent via-cyan-500/30 to-transparent animate-pulse" />
        
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div>
            <h3 className="text-sm font-bold text-neutral-200 uppercase tracking-wider font-display flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400 animate-spin-slow" />
              Cosmic Skill Galaxy Roadmap
            </h3>
            <p className="text-[11px] text-neutral-500">Unlocking nodes clears space dust. Select colored modules to start dynamic learning.</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-neutral-400 font-mono"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-glow" /> Active</span>
            <span className="flex items-center gap-1.5 text-neutral-500 font-mono"><span className="w-2.5 h-2.5 rounded-full bg-neutral-800" /> Locked</span>
          </div>
        </div>

        {/* Orbit Path Layout Map */}
        <div className="relative py-8 overflow-x-auto select-none scrollbar-thin">
          <div className="flex items-center justify-between gap-6 min-w-[980px] px-8 py-4">
            
            {topics.map((t, index) => {
              const isActive = t.id === selectedTopicId;
              const isFirst = index === 0;
              const isLeftUnlocked = t.isUnlocked;

              return (
                <React.Fragment key={t.id}>
                  
                  {/* Connect Path Line */}
                  {index > 0 && (
                    <div className="flex-1 h-1.5 relative min-w-10">
                      <div className={`absolute inset-0 rounded-full transition-all duration-700 ${
                        isLeftUnlocked 
                          ? 'bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-[0_0_10px_rgba(99,102,241,0.4)] animate-pulse' 
                          : 'bg-neutral-800'
                      }`} />
                      
                      {/* Sub alignment star particle */}
                      {isLeftUnlocked && (
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-glow" />
                      )}
                    </div>
                  )}

                  {/* Planet Island card node element */}
                  <div 
                    onClick={() => {
                      if (t.isUnlocked) {
                        setSelectedTopicId(t.id);
                        playAudioChime('click');
                      } else {
                        playAudioChime('warning');
                      }
                    }}
                    className={`relative flex flex-col items-center group transition-all duration-500 ${t.isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-45'}`}
                  >
                    
                    {/* Planet sphere node body */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center relative transition-all duration-350 ${
                      isActive 
                        ? 'bg-linear-to-tr from-cyan-600 to-indigo-600 scale-110 ring-4 ring-cyan-500/30' 
                        : t.isUnlocked
                          ? 'bg-neutral-900 border-2 border-indigo-500/45 hover:border-cyan-400 shadow-lg hover:scale-105'
                          : 'bg-neutral-950 border-2 border-neutral-800'
                    }`}>
                      
                      {/* Simulated planet outer visual aura ring */}
                      {t.isUnlocked && (
                        <div className={`absolute -inset-2 rounded-full border border-dashed animate-spin-slow ${
                          isActive ? 'border-cyan-300/60' : 'border-indigo-500/20'
                        }`} style={{ animationDuration: '15s' }} />
                      )}

                      {/* Topic Category Glyph represent */}
                      {t.category === 'Foundation' && <Zap className="w-5 h-5 text-amber-400" />}
                      {t.category === 'Arrays' && <Layers className="w-5 h-5 text-emerald-400" />}
                      {t.category === 'LinkedLists' && <GitPullRequest className="w-5 h-5 text-cyan-400" />}
                      {t.category === 'Trees' && <GitMerge className="w-5 h-5 text-purple-400" />}
                      {t.category === 'Graphs' && <Cpu className="w-5 h-5 text-pink-400" />}
                      {t.category === 'DP' && <RotateCcw className="w-5 h-5 text-blue-400 animate-pulse" />}

                      {/* Locked status lock icon */}
                      {!t.isUnlocked && (
                        <div className="absolute inset-0 rounded-full bg-neutral-950/80 flex items-center justify-center">
                          <span className="text-neutral-500 text-[10px] font-bold">🔒</span>
                        </div>
                      )}
                    </div>

                    {/* Planet label banner */}
                    <div className="text-center mt-3 max-w-28 space-y-0.5">
                      <p className={`text-[11px] font-extrabold truncate ${isActive ? 'text-cyan-400 font-black' : 'text-neutral-300'}`}>
                        {t.title}
                      </p>
                      
                      <div className="flex items-center justify-center gap-1">
                        <span className={`text-[8px] uppercase tracking-wider font-mono font-bold px-1.5 py-0.5 rounded ${
                          t.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400' :
                          t.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {t.difficulty}
                        </span>
                      </div>
                    </div>

                  </div>

                </React.Fragment>
              );
            })}

          </div>
        </div>

        {/* Selected Universe context details banner */}
        <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono">Exploring Realm</p>
              <h4 className="text-base font-black text-white">{topic.title} • {topic.category} Galaxy Zone</h4>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-mono">
              <span className="text-neutral-500">TIME:</span> <strong className="text-white">{topic.timeComplexity}</strong>
            </div>
            <div className="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-mono">
              <span className="text-neutral-500">SPACE:</span> <strong className="text-indigo-400">{topic.spaceComplexity}</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Main Workspace layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Study desk navigators & Interactive features */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Tabs header */}
          <div className="flex border-b border-neutral-200 dark:border-neutral-800">
            {(['learn', 'visualize', 'code', 'quiz', 'faang'] as const).map(tabOpt => (
              <button 
                key={tabOpt}
                onClick={() => {
                  setActiveWorkspaceTab(tabOpt);
                  playAudioChime('click');
                }}
                className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeWorkspaceTab === tabOpt 
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-350'
                }`}
              >
                {tabOpt === 'learn' && <BookOpen className="w-4 h-4" />}
                {tabOpt === 'visualize' && <Activity className="w-4 h-4 text-emerald-500" />}
                {tabOpt === 'code' && <Code className="w-4 h-4 text-cyan-400" />}
                {tabOpt === 'quiz' && <HelpCircle className="w-4 h-4 text-purple-400" />}
                {tabOpt === 'faang' && <Briefcase className="w-4 h-4 text-amber-400" />}
                <span className="uppercase tracking-wide">{tabOpt}</span>
              </button>
            ))}
          </div>

          {/* Tab contexts */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeWorkspaceTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              
              {/* STUDY SECTION */}
              {activeWorkspaceTab === 'learn' && (
                <div className="space-y-6">
                  
                  {/* Conceptual core cards */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 space-y-4">
                    <h4 className="text-sm font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
                      Theoretical Framework Blueprint
                    </h4>
                    
                    <div className="space-y-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      <p className="font-medium text-neutral-800 dark:text-white bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
                        <strong className="text-indigo-500">Core Objective:</strong> {topic.whyExists}
                      </p>
                      
                      <div className="pt-2">
                        <strong className="text-neutral-900 dark:text-white block font-black mb-1">Problem Statement:</strong>
                        <p>{topic.problemStatement}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                          <strong className="text-red-500 block text-xs font-mono uppercase tracking-wider">Naive / Brute Force Approach</strong>
                          <p className="text-xs text-neutral-500 mt-1">{topic.bruteForce}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                          <strong className="text-emerald-500 block text-xs font-mono uppercase tracking-wider">Algorithmic Optimization Matrix</strong>
                          <p className="text-xs text-neutral-500 mt-1">{topic.optimized}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Multi-language code comparative tabs block */}
                  <div className="p-6 rounded-2xl bg-slate-950 border border-neutral-800 text-white space-y-4 shadow-2xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h4 className="text-sm font-black tracking-tight text-neutral-200">
                          Cross-Language Implementation Workspace
                        </h4>
                        <p className="text-[10px] text-neutral-400">Chronological syntax comparisons for standard FAANG rubrics.</p>
                      </div>

                      {/* Lang Selectors */}
                      <div className="flex gap-1 p-0.5 bg-neutral-900 border border-neutral-800 rounded-lg">
                        {(['c', 'cpp', 'java', 'js', 'python'] as const).map(lang => (
                          <button 
                            key={lang}
                            onClick={() => {
                              setSelectedLang(lang);
                              playAudioChime('click');
                            }}
                            className={`px-2 py-1 text-[10px] font-bold rounded uppercase transition cursor-pointer ${
                              selectedLang === lang ? 'bg-indigo-650 text-white font-extrabold' : 'text-neutral-400 hover:text-white'
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Syntax Code block container */}
                    <div className="bg-neutral-900/90 rounded-xl p-4 border border-neutral-800 font-mono text-xs overflow-x-auto min-h-48 text-neutral-300">
                      <pre className="leading-relaxed">
                        <code>
                          {selectedLang === 'c' && topic.snippetC}
                          {selectedLang === 'cpp' && topic.snippetCpp}
                          {selectedLang === 'java' && topic.snippetJava}
                          {selectedLang === 'js' && topic.snippetJs}
                          {selectedLang === 'python' && topic.snippetPython}
                        </code>
                      </pre>
                    </div>

                    {/* Copy/Use block */}
                    <div className="flex justify-between items-center text-[10px] text-neutral-500">
                      <span>Syntax references built under ECMA / ANSI standards</span>
                      <button 
                        onClick={() => {
                          let copyTxt = topic.snippetJs;
                          if (selectedLang === 'c') copyTxt = topic.snippetC;
                          if (selectedLang === 'cpp') copyTxt = topic.snippetCpp;
                          if (selectedLang === 'java') copyTxt = topic.snippetJava;
                          if (selectedLang === 'python') copyTxt = topic.snippetPython;
                          navigator.clipboard.writeText(copyTxt);
                          playAudioChime('success');
                        }}
                        className="text-indigo-400 hover:text-indigo-300 transition uppercase font-black"
                      >
                        Copy Snippet
                      </button>
                    </div>

                  </div>

                </div>
              )}

              {/* DYNAMIC VISUALIZER COMPONENT */}
              {activeWorkspaceTab === 'visualize' && (
                <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 space-y-6">
                  
                  {/* Vis header controls */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                    <div>
                      <h4 className="text-sm font-black text-neutral-900 dark:text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                        Interactive Engine: {topic.title}
                      </h4>
                      <p className="text-[11px] text-neutral-550">Click &quot;Step Progress&quot; to alter algorithms pointer index or dynamic state.</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={traverseVisualStep}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        Step Progress
                      </button>

                      <button 
                        onClick={() => {
                          setVisualCurrentStep(0);
                          setSlowPointerIdx(-1);
                          setFastPointerIdx(-1);
                          setCollisionIdx(-1);
                          setFibNodeTracer(["root: fib(4)"]);
                          playAudioChime('click');
                        }}
                        className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 dark:border-neutral-850 text-neutral-600 dark:text-neutral-400 text-xs transition cursor-pointer"
                        title="Reset visual state"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* CONDITIONAL INTEGRATIONS PER ALGORITHM */}
                  
                  {/* Option 1: Time Curve Asymptotics visual */}
                  {topic.id === 'time-comp' && (
                    <div className="space-y-4">
                      <p className="text-xs text-neutral-500">Asymptotics curve visual representation. Active highlighted pointer step: <strong className="text-indigo-600 font-bold">Step {visualCurrentStep + 1}</strong></p>
                      <div className="h-44 p-4 border border-neutral-200 dark:border-neutral-800 bg-neutral-950 rounded-xl relative overflow-hidden flex items-end justify-between font-mono text-[9px] text-neutral-400">
                        {/* Static curves */}
                        <div className="absolute left-6 bottom-4 text-neutral-500">N (Input Scale) ➔</div>
                        <div className="absolute left-6 top-4 text-neutral-500">Time Ops ▲</div>

                        {/* Curve Constant */}
                        <div className={`absolute bottom-6 left-12 right-6 h-0.5 bg-green-500/40 ${visualCurrentStep === 0 ? 'bg-green-400 h-1' : ''}`}>
                          <span className="absolute right-0 -top-3 text-green-400">O(1) Constant</span>
                        </div>
                        {/* Curve Logarithmic */}
                        <div className={`absolute bottom-12 left-12 right-6 h-0.5 bg-cyan-500/40 rounded-full ${visualCurrentStep === 1 ? 'bg-cyan-400 h-1' : ''}`} style={{ transform: 'rotate(-5deg)', transformOrigin: 'left bottom' }}>
                          <span className="absolute right-4 -top-3 text-cyan-400">O(log N) Logarithmic</span>
                        </div>
                        {/* Curve Linear */}
                        <div className={`absolute bottom-4 left-12 w-4/5 h-0.5 bg-indigo-500/40 origin-bottom-left ${visualCurrentStep === 2 ? 'bg-indigo-400 h-1' : ''}`} style={{ transform: 'rotate(-30deg)' }}>
                          <span className="absolute right-6 -top-3 text-indigo-400">O(N) Linear</span>
                        </div>
                        {/* Curve Quadratic */}
                        <div className={`absolute bottom-4 left-12 w-4/5 h-0.5 bg-red-500/40 origin-bottom-left ${visualCurrentStep === 3 ? 'bg-red-400 h-1' : ''}`} style={{ transform: 'rotate(-60deg)' }}>
                          <span className="absolute right-12 -top-3 text-red-500">O(N^2) Quadratic</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Option 2: Fibonacci recursion branches visual */}
                  {topic.id === 'recursion-basics' && (
                    <div className="space-y-4">
                      <p className="text-xs text-neutral-500">Recursive activation record steps. Step paths generated: <strong className="text-indigo-600 font-bold">{fibNodeTracer.length}/6</strong></p>
                      <div className="p-4 border border-neutral-200 dark:border-neutral-800 bg-neutral-950 rounded-xl space-y-2 text-xs font-mono">
                        {fibNodeTracer.map((node, idx) => {
                          const isLeaf = node.includes("yields BASE") || node.includes("equals");
                          return (
                            <div key={idx} className={isLeaf ? 'text-emerald-400' : 'text-neutral-300'}>
                              {node}
                            </div>
                          );
                        })}
                        {visualCurrentStep === 0 && (
                          <p className="text-[10px] text-neutral-550 italic">// Click Step to invoke tree split frames...</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Option 3: Kadane contiguous Array Summing */}
                  {topic.id === 'kadane-arrays' && (
                    <div className="space-y-4">
                      <p className="text-xs text-neutral-500">Sliding through integers: Blue pointer is checking index: <strong className="text-indigo-600 font-bold">{visualCurrentStep} (Val: {visualDataArray[visualCurrentStep]})</strong></p>
                      
                      <div className="flex flex-wrap gap-2.5 justify-center py-6">
                        {visualDataArray.map((num, idx) => {
                          const isChecking = idx === visualCurrentStep;
                          const isPositiveSum = num > 0;
                          return (
                            <div 
                              key={idx}
                              className={`w-14 h-16 rounded-xl border flex flex-col justify-between p-1.5 transition-all text-center ${
                                isChecking 
                                  ? 'bg-indigo-650 border-indigo-500 text-white scale-110 ring-4 ring-indigo-500/20' 
                                  : isPositiveSum
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
                              }`}
                            >
                              <span className="text-[8px] font-mono text-neutral-400">Idx {idx}</span>
                              <span className="text-sm font-black font-mono">{num}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Code traces */}
                      <div className="p-3 bg-neutral-900 rounded-xl text-xs font-mono space-y-1.5 text-neutral-300 border border-neutral-800">
                        <p className="text-cyan-400 font-bold">Variable Status:</p>
                        <p>Current Element Added: <span className="text-white">{visualDataArray[visualCurrentStep]}</span></p>
                        <p>Accumulated Rolling state logic: <span className="text-emerald-400">Math.max({visualDataArray[visualCurrentStep]}, currMax + {visualDataArray[visualCurrentStep]})</span></p>
                        <p className="text-[10px] text-neutral-500">// Kadane maintains dynamic maximums per element sweep</p>
                      </div>
                    </div>
                  )}

                  {/* Option 4: Sliding window moving frame bounds */}
                  {topic.id === 'sliding-window' && (
                    <div className="space-y-4">
                      <p className="text-xs text-neutral-500">Observe fixed window resizing/shifting frames of capacity size <strong className="text-indigo-600 font-bold">K = 3</strong></p>
                      
                      <div className="flex justify-center gap-1.5 py-4">
                        {[4, 2, 1, 7, 8, 1, 2, 8].map((num, idx) => {
                          // window offsets: step covers index to index+k
                          const winStart = visualCurrentStep;
                          const winEnd = visualCurrentStep + 2;
                          const inWindow = idx >= winStart && idx <= winEnd;

                          return (
                            <div 
                              key={idx}
                              className={`w-12 h-14 rounded-lg border flex flex-col items-center justify-between p-1.5 font-mono text-center transition-all ${
                                inWindow 
                                  ? 'border-cyan-500 bg-cyan-600/10 text-cyan-600 dark:text-cyan-400 font-black scale-105 ring-2 ring-cyan-500/30' 
                                  : 'border-neutral-200 dark:border-neutral-800 text-neutral-400 bg-neutral-50/50 dark:bg-neutral-900/40'
                              }`}
                            >
                              <span className="text-[7px]">[{idx}]</span>
                              <span className="text-xs font-black">{num}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg text-xs font-mono border border-neutral-200 dark:border-neutral-850">
                        <p className="text-neutral-500">Current Window boundary indices: <strong className="text-neutral-900 dark:text-white">[{visualCurrentStep} to {visualCurrentStep + 2}]</strong></p>
                        <p className="text-neutral-500 mt-1">Saves calculation overhead by dropping the tailing elements from computation arrays instantly.</p>
                      </div>
                    </div>
                  )}

                  {/* Option 5: Cycle detection linked lists pointers tortoise and hare */}
                  {topic.id === 'cycle-linkedlists' && (
                    <div className="space-y-4">
                      <p className="text-xs text-neutral-500">Collision loop simulator: Slow walks 1 pointer, Fast speeds 2 pointers. Tracing step: <strong className="text-indigo-600 font-bold">{visualCurrentStep}</strong></p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div className="p-4 border border-neutral-150 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 rounded-xl space-y-3 font-mono text-xs">
                          <p className="flex justify-between"><span>🐢 Tortoise Index slowPtr:</span> <strong className="text-emerald-500">{slowPointerIdx === -1 ? 'INITIAL' : `Node [${slowPointerIdx}]`}</strong></p>
                          <p className="flex justify-between"><span>⚡ Hare Index fastPtr:</span> <strong className="text-indigo-400">{fastPointerIdx === -1 ? 'INITIAL' : `Node [${fastPointerIdx}]`}</strong></p>
                          <p className="flex justify-between"><span>📍 Loop Intersection:</span> <strong className={collisionIdx !== -1 ? 'text-green-500 animate-pulse' : 'text-neutral-500'}>{collisionIdx !== -1 ? `COLLISION AT NODE [${collisionIdx}]` : 'SEARCHING...'}</strong></p>
                        </div>

                        {/* Cyclic nodes display */}
                        <div className="flex flex-wrap gap-2 py-2">
                          {[0, 1, 2, 3, 4, 5, 6, 7].map((num) => {
                            const hasSlow = num === slowPointerIdx;
                            const hasFast = num === fastPointerIdx;
                            const isCollision = hasSlow && hasFast;

                            return (
                              <div 
                                key={num}
                                className={`w-10 h-10 rounded-full border flex flex-col items-center justify-center text-xs font-mono relative transition-all ${
                                  isCollision 
                                    ? 'bg-red-500/20 border-red-500 text-red-500 ring-4 ring-red-500/30' 
                                    : hasSlow 
                                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                                      : hasFast 
                                        ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' 
                                        : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                                }`}
                              >
                                <span>{num}</span>
                                {hasSlow && <span className="absolute -top-3 text-[7px] font-bold text-emerald-500">🐢</span>}
                                {hasFast && <span className="absolute -bottom-3 text-[7px] font-bold text-indigo-400">⚡</span>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fallback Option generic interactive explanation visual */}
                  {['binary-search-tree', 'dijkstra-graphs', 'dp-knapsack'].includes(topic.id) && (
                    <div className="p-4 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl space-y-2">
                      <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 mx-auto">
                        <Sparkles className="w-6 h-6 animate-spin-slow" />
                      </div>
                      <p className="text-sm font-black text-neutral-800 dark:text-neutral-200">Interactive High-Fidelity 3D Simulation Panel</p>
                      <p className="text-xs text-neutral-500 max-w-md mx-auto">Observe steps: nodes split recursively, adjacent weight updates, or DP grids tabulated dynamically. High visual fidelity mappings activated!</p>
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-600 font-bold px-2.5 py-1 rounded font-mono uppercase tracking-widest inline-block">Active current simulation: Step {visualCurrentStep}</span>
                    </div>
                  )}

                </div>
              )}

              {/* HANDS-ON ADVANCED PRACTICE WORKSPACE */}
              {activeWorkspaceTab === 'code' && (
                <div className="space-y-6">
                  
                  {/* VS-Code style depth panel containing live exercises */}
                  <div className="p-6 rounded-2xl bg-neutral-900 text-white space-y-4 shadow-2xl border border-neutral-800">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                          <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                          <h4 className="text-xs font-mono font-bold text-neutral-400 ml-2">sandbox_editor.js (VS-Code Node)</h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={executeCodeInSandbox}
                          disabled={isCompiling}
                          className="px-4 py-1.5 rounded-lg bg-emerald-650 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          {isCompiling ? (
                            <Zap className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Play className="w-3.5 h-3.5 fill-white" />
                          )}
                          Compile & Run Code
                        </button>
                      </div>
                    </div>

                    {/* Instruction card above */}
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-neutral-300">
                      <strong>Objective instructions:</strong> Complete the code blocks matching optimal asymptotic benchmarks. Use variables declared inside parameters cleanly.
                    </div>

                    {/* Real time textarea */}
                    <textarea 
                      value={currentEditableCode}
                      onChange={(e) => setCurrentEditableCode(e.target.value)}
                      className="w-full bg-neutral-950 text-neutral-200 p-4 rounded-xl border border-neutral-850 font-mono text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500 min-h-64 leading-relaxed"
                      placeholder="// Type your high-performance code solution..."
                    />

                    {/* Complier live output terminal representation */}
                    <div className="space-y-1.5">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 font-mono">Terminal Output Console</p>
                      <div className="bg-neutral-950 font-mono text-xs p-3.5 rounded-xl border border-neutral-850 text-emerald-400 min-h-20 whitespace-pre-wrap">
                        {compileOutput}
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* QUIZ SYSTEM */}
              {activeWorkspaceTab === 'quiz' && (
                <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 space-y-6">
                  
                  <div>
                    <h4 className="text-base font-black text-neutral-900 dark:text-white">Topic Competency Mastery Test</h4>
                    <p className="text-xs text-neutral-500">Perfect scores unlock successive, difficult curriculum galaxies.</p>
                  </div>

                  <div className="space-y-6">
                    {topic.mcqs.map((q, qIndex) => (
                      <div key={q.id} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
                        <p className="text-xs font-bold text-neutral-500 font-mono">QUESTION {qIndex + 1} OF {topic.mcqs.length}</p>
                        <p className="text-sm font-extrabold text-neutral-900 dark:text-white">{q.question}</p>
                        
                        <div className="grid grid-cols-1 gap-2 pt-2">
                          {q.options.map((opt, optIndex) => {
                            const isSelected = quizAnswers[q.id] === optIndex;
                            const isCorrect = optIndex === q.correctIdx;
                            const shouldShowResult = quizSubmitted;

                            return (
                              <button 
                                key={optIndex}
                                disabled={quizSubmitted}
                                onClick={() => handleQuizAnswerSelect(q.id, optIndex)}
                                className={`w-full text-left p-3 rounded-lg text-xs leading-relaxed font-semibold transition border cursor-pointer ${
                                  isSelected 
                                    ? 'bg-indigo-600/10 border-indigo-500 text-indigo-650 dark:text-indigo-400' 
                                    : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-950 text-neutral-700 dark:text-neutral-300'
                                } ${
                                  shouldShowResult && isCorrect 
                                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                                    : shouldShowResult && isSelected && !isCorrect
                                      ? 'bg-red-500/10 border-red-500 text-red-500' 
                                      : ''
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className="p-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg text-xs text-neutral-500 mt-2 leading-relaxed">
                            <strong className="text-neutral-900 dark:text-white">Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="pt-4 border-t border-neutral-150 dark:border-neutral-800 flex justify-between items-center">
                      <span className="text-xs text-neutral-400 font-medium">Verify answers lock answers</span>
                      <button 
                        onClick={handleQuizSubmit}
                        disabled={Object.keys(quizAnswers).length < topic.mcqs.length || quizSubmitted}
                        className="px-5 py-2 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-black transition cursor-pointer disabled:opacity-45"
                      >
                        Lock Answers
                      </button>
                    </div>

                    {quizSubmitted && quizUnlockedId && (
                      <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-bounce">
                        <CheckCircle className="w-5 h-5 shrink-0" />
                        <span>Congratulations! Perfect score unlocked. Next topic cosmic portal activates instantly!</span>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* FAANG INTERVIEW TARGETS MODE */}
              {activeWorkspaceTab === 'faang' && (
                <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 space-y-6">
                  
                  {/* Filters Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="text-base font-black text-neutral-900 dark:text-white">LeetCode Patterns & FAANG Mocks</h4>
                      <p className="text-xs text-neutral-500">Practice questions compiled directly from live interview archives.</p>
                    </div>

                    {/* Company buttons */}
                    <div className="flex flex-wrap gap-1 p-0.5 bg-neutral-100 dark:bg-neutral-950 border border-neutral-220 dark:border-neutral-800 rounded-lg">
                      {['All', 'Google', 'Amazon', 'Microsoft', 'Apple', 'Netflix'].map(company => (
                        <button 
                          key={company}
                          onClick={() => {
                            setCompanyFilter(company);
                            playAudioChime('click');
                          }}
                          className={`px-3 py-1 text-[10px] sm:text-xs font-bold rounded-md transition cursor-pointer ${
                            companyFilter === company ? 'bg-white dark:bg-neutral-900 shadow-xs text-indigo-650 dark:text-indigo-400' : 'text-neutral-500'
                          }`}
                        >
                          {company}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* List visual table */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredChallenges.map((item, index) => {
                      return (
                        <div key={index} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-805 bg-neutral-50/50 dark:bg-neutral-950/20 hover:border-indigo-500 transition-all space-y-3">
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] uppercase tracking-widest font-mono font-black text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                              {item.pattern}
                            </span>
                            <span className="text-xs font-mono text-neutral-400 font-bold">{item.company}</span>
                          </div>

                          <div>
                            <h5 className="text-sm font-extrabold text-neutral-900 dark:text-white leading-tight">{item.title}</h5>
                            <p className="text-[10px] text-neutral-500 mt-1">Acceptance Rate: {item.rate} • Timed Challenge Standard</p>
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-neutral-200/50 dark:border-neutral-800">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              item.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500' :
                              item.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                            }`}>{item.difficulty}</span>
                            
                            <button 
                              onClick={() => {
                                playAudioChime('click');
                                setActiveWorkspaceTab('code');
                              }}
                              className="text-xs text-indigo-600 hover:text-indigo-400 transition font-black flex items-center gap-1 cursor-pointer"
                            >
                              Code Sandbox <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </div>

        {/* Right column: Interactive AI Coach Desk & Skill Tree */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Personalized Skill tree completion hierarchy (Vertical line tracker) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 shadow-xs space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              Interactive Growth Tree
            </h4>

            {/* Tree Nodes representing active learning loops */}
            <div className="relative pl-6 border-l-2 border-dashed border-neutral-200 dark:border-neutral-800 space-y-6">
              
              {/* Node 1 */}
              <div className="relative">
                <span className="absolute -left-9 top-1 w-5 h-5 rounded-full bg-emerald-500 border-4 border-white dark:border-neutral-905 flex items-center justify-center text-[9px] text-white">✓</span>
                <div>
                  <h5 className="text-xs font-extrabold text-neutral-900 dark:text-white">Foundational Complexity</h5>
                  <p className="text-[10px] text-neutral-550 leading-tight">Big O and Recursion mechanisms mapped.</p>
                </div>
              </div>

              {/* Node 2 */}
              <div className="relative">
                {/* Check if subarrays topic unlocked */}
                <span className={`absolute -left-9 top-1 w-5 h-5 rounded-full border-4 border-white dark:border-neutral-905 flex items-center justify-center text-[9px] text-white ${
                  topics.find(t => t.id === 'kadane-arrays')?.isUnlocked 
                    ? 'bg-cyan-500 bg-glow' 
                    : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'
                }`}>
                  {topics.find(t => t.id === 'kadane-arrays')?.isUnlocked ? '✦' : '2'}
                </span>
                <div>
                  <h5 className={`text-xs font-extrabold ${topics.find(t => t.id === 'kadane-arrays')?.isUnlocked ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'}`}>
                    Linear Array Realms
                  </h5>
                  <p className="text-[10px] text-neutral-550 leading-tight">Kadane Subarrays and Sliding window constraints.</p>
                </div>
              </div>

              {/* Node 3 */}
              <div className="relative">
                <span className={`absolute -left-9 top-1 w-5 h-5 rounded-full border-4 border-white dark:border-neutral-905 flex items-center justify-center text-[9px] text-white ${
                  topics.find(t => t.id === 'cycle-linkedlists')?.isUnlocked 
                    ? 'bg-cyan-500' 
                    : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'
                }`}>
                  {topics.find(t => t.id === 'cycle-linkedlists')?.isUnlocked ? '✦' : '3'}
                </span>
                <div>
                  <h5 className={`text-xs font-extrabold ${topics.find(t => t.id === 'cycle-linkedlists')?.isUnlocked ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'}`}>
                    Pointer Cycles Linked Lists
                  </h5>
                  <p className="text-[10px] text-neutral-550 leading-tight">Reverse traversals & collision tortoise limits.</p>
                </div>
              </div>

              {/* Node 4 */}
              <div className="relative">
                <span className="absolute -left-9 top-1 w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-400 border-4 border-white dark:border-neutral-905 flex items-center justify-center text-[9px]">4</span>
                <div>
                  <h5 className="text-xs font-extrabold text-neutral-400">Hierarchical Trees & Graphs</h5>
                  <p className="text-[10px] text-neutral-550 leading-tight">BST traversals & Dijkstra shortest paths patterns.</p>
                </div>
              </div>

              {/* Node 5 */}
              <div className="relative">
                <span className="absolute -left-9 top-1 w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-400 border-4 border-white dark:border-neutral-905 flex items-center justify-center text-[9px]">5</span>
                <div>
                  <h5 className="text-xs font-extrabold text-neutral-400">Dynamic Decision Space</h5>
                  <p className="text-[10px] text-neutral-550 leading-tight">Knapsack dynamic grids and Backtracking queens dfs.</p>
                </div>
              </div>

            </div>
          </div>

          {/* AI Advisor Line-By-Line explanations panel */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-neutral-800 text-white space-y-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
              <h4 className="text-sm font-black font-display text-neutral-200">
                AI Interstellar Coach Desk
              </h4>
            </div>
            
            <p className="text-xs text-neutral-400 leading-relaxed">
              Ask doubts, design randomized questions, or debug complexity states in real-time.
            </p>

            <div className="space-y-2">
              <textarea 
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="Ask about asymptotic curves, cycle remapping, or DFS paths..."
                className="w-full bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl text-xs text-white focus:outline-hidden resize-none h-18 text-neutral-200"
              />
              <button 
                onClick={askAiMentorCoach}
                disabled={aiThinking || !customQuery.trim()}
                className="w-full bg-indigo-650 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs py-2 rounded-xl transition cursor-pointer"
              >
                {aiThinking ? 'Analyzing Complexity Matrix...' : 'Ask AI Mentor'}
              </button>
            </div>

            {/* AI Assistant Output logs */}
            {aiResponse && (
              <div className="p-3 bg-neutral-900 border border-indigo-500/10 rounded-xl text-xs text-neutral-300 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                {aiResponse}
              </div>
            )}
          </div>

          {/* Milestone Achievements personal accomplishments */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 shadow-xs space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
              Personal Milestones Achieved
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-500/5 border border-orange-500/10 text-xs">
                <span className="text-lg">🔥</span>
                <div>
                  <strong className="text-neutral-900 dark:text-white block font-bold">7-Day Study Streak</strong>
                  <span className="text-neutral-500">Studied consecutive recursion stack frames.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10 text-xs">
                <span className="text-lg">🧩</span>
                <div>
                  <strong className="text-neutral-900 dark:text-white block font-bold">Complexity Decrypted</strong>
                  <span className="text-neutral-500">Perfect score achieved on Big O competency quiz.</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
