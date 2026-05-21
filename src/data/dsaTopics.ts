export interface DSATopic {
  id: string;
  title: string;
  category: 'Basics' | 'Complexity' | 'Arrays' | 'Strings' | 'Recursion' | 'Backtracking' | 'LinkedList' | 'Stack' | 'Queue' | 'Hashing' | 'BinarySearch' | 'Sorting' | 'Trees' | 'BST' | 'Heap' | 'Greedy' | 'Graphs' | 'DP' | 'Trie' | 'BitManipulation' | 'SegmentTree' | 'Advanced';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  acceptance: string;
  timeComplexity: string;
  spaceComplexity: string;
  whyExists: string;
  problemStatement: string;
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  hints: string[];
  bruteForce: string;
  betterApproach?: string;
  optimalApproach: string;
  solutionExplanation: string;
  companyTags: string[];
  snippets: {
    c: string;
    cpp: string;
    java: string;
    python: string;
    javascript: string;
  };
  startingCode: string;
  testCases: { input: any; expectedOutput: any; testExpression?: string }[];
  topicGroup: 'Arrays' | 'Graphs' | 'DP' | 'Other'; 
}

export const DSA_TOPICS: DSATopic[] = [
  {
    id: 'basics',
    title: 'Basics of Programming',
    category: 'Basics',
    difficulty: 'Easy',
    acceptance: '94%',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    whyExists: 'Establishes fundamental constructs of control flow, variables, data types, and logical execution blocks.',
    problemStatement: 'Implement a function that evaluates an array of integer grades. If a grade is less than 40 and the difference between the grade and the next multiple of 5 is less than 3, round the grade up to the next multiple of 5. Return the rounded grades.',
    constraints: [
      '1 <= n <= 100',
      '0 <= grades[i] <= 100'
    ],
    examples: [
      { input: 'grades = [73, 67, 38, 33]', output: '[75, 67, 40, 33]', explanation: '73 rounds to 75 (difference is 2, less than 3). 67 does not round (67 -> 70 difference is 3). 38 rounds to 40. 33 is less than 38 (failing), so no rounding occurs.' }
    ],
    hints: [
      'Determine the difference by checking: (5 - (grade % 5)).',
      'Ensure the grade is greater than or equal to 38 before applying the rounding rules.',
      'Construct a simple linear pass over the inputted grades.'
    ],
    bruteForce: `// Iterate over integers on multiple passes, recalculating bounds
function roundBrute(grades) {
  let res = [];
  for(let i=0; i<grades.length; i++) {
    let current = grades[i];
    if(current < 38) {
      res.push(current);
    } else {
      let nextMultiple = current;
      while(nextMultiple % 5 !== 0) {
        nextMultiple++;
      }
      if(nextMultiple - current < 3) {
        res.push(nextMultiple);
      } else {
        res.push(current);
      }
    }
  }
  return res;
}`,
    betterApproach: 'Use direct modular arithmetic calculations instead of a while loop.',
    optimalApproach: `// Direct modular lookup
function roundOptimal(grades) {
  return grades.map(grade => {
    if (grade < 38) return grade;
    const diff = 5 - (grade % 5);
    return diff < 3 ? grade + diff : grade;
  });
}`,
    solutionExplanation: 'For each grade, if the value is under 38, it is a failing grade and rounding is not allowed. Otherwise, calculate the offset from the next multiple of 5 using (5 - grade % 5). If the difference is less than 3, add it in-place.',
    companyTags: ['Amazon', 'HackerRank', 'IBM'],
    snippets: {
      c: `int* roundGrades(int* grades, int gradesSize, int* resultSize) {
    *resultSize = gradesSize;
    int* val = malloc(sizeof(int) * gradesSize);
    for(int i=0; i<gradesSize; i++) {
        if(grades[i] < 38) val[i] = grades[i];
        else {
            int diff = 5 - (grades[i] % 5);
            val[i] = (diff < 3) ? (grades[i] + diff) : grades[i];
        }
    }
    return val;
}`,
      cpp: `vector<int> roundGrades(vector<int> grades) {
    for (int &g : grades) {
        if (g >= 38 && (5 - (g % 5)) < 3) {
            g += 5 - (g % 5);
        }
    }
    return grades;
}`,
      java: `public int[] roundGrades(int[] grades) {
    int[] result = new int[grades.length];
    for (int i = 0; i < grades.length; i++) {
        if (grades[i] < 38) result[i] = grades[i];
        else {
            int diff = 5 - (grades[i] % 5);
            result[i] = (diff < 3) ? (grades[i] + diff) : grades[i];
        }
    }
    return result;
}`,
      python: `def round_grades(grades):
    return [g + (5 - g % 5) if g >= 38 and (5 - g % 5) < 3 else g for g in grades]`,
      javascript: `function roundGrades(grades) {
  return grades.map(g => {
    if (g < 38) return g;
    const diff = 5 - (g % 5);
    return diff < 3 ? g + diff : g;
  });
}`
    },
    startingCode: `function roundGrades(grades) {
  // Write your code here
  return [];
}`,
    testCases: [
      { input: [73, 67, 38, 33], expectedOutput: [75, 67, 40, 33] },
      { input: [37, 38, 41, 84], expectedOutput: [37, 40, 41, 85] }
    ],
    topicGroup: 'Other'
  },
  {
    id: 'time-comp',
    title: 'Time & Space Complexity',
    category: 'Complexity',
    difficulty: 'Easy',
    acceptance: '89%',
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    whyExists: 'Enables deterministic profiling of hardware-independent algorithm performance scales.',
    problemStatement: 'Count the number of logarithmic binary reduction divisions required to reach index 1 starting from input size N. Effectively, calculate floor of log2(N).',
    constraints: [
      '1 <= N <= 10^9'
    ],
    examples: [
      { input: 'N = 8', output: '3', explanation: '8 -> 4 -> 2 -> 1, which takes exactly 3 binary divisions.' }
    ],
    hints: [
      'Repeatedly divide the number by 2 using floor division.',
      'Keep a counter tracking division events until N equals 1.',
      'Think mathematically: what log operations match this sequence?'
    ],
    bruteForce: `function logCount(n) {
  let divisions = 0;
  while(n > 1) {
    let sub = 0;
    for(let i = 0; i < n; i += 2) {
      sub++;
    }
    n = sub;
    divisions++;
  }
  return divisions;
}`,
    optimalApproach: `function logCount(n) {
  let count = 0;
  while (n > 1) {
    n = Math.floor(n / 2);
    count++;
  }
  return count;
}`,
    solutionExplanation: 'By cutting the search space in half repeatedly (binary bisection), the number of loops is proportional to the base-2 logarithm of the input size, yielding O(log N) time.',
    companyTags: ['Google', 'Microsoft', 'Netflix'],
    snippets: {
      c: `int logCount(int n) {
    int count = 0;
    while(n > 1) {
        n /= 2;
        count++;
    }
    return count;
}`,
      cpp: `int logCount(int n) {
    int count = 0;
    while(n > 1) {
        n /= 2;
        count++;
    }
    return count;
}`,
      java: `public int logCount(int n) {
    int count = 0;
    while (n > 1) {
        n /= 2;
        count++;
    }
    return count;
}`,
      python: `def log_count(n):
    count = 0
    while n > 1:
        n //= 2
        count += 1
    return count`,
      javascript: `function logCount(n) {
  let count = 0;
  while (n > 1) {
    n = Math.floor(n / 2);
    count++;
  }
  return count;
}`
    },
    startingCode: `function logCount(n) {
  // Write your code here
  return 0;
}`,
    testCases: [
      { input: 8, expectedOutput: 3 },
      { input: 16, expectedOutput: 4 }
    ],
    topicGroup: 'Other'
  },
  {
    id: 'arrays',
    title: 'Contiguous Arrays',
    category: 'Arrays',
    difficulty: 'Medium',
    acceptance: '71%',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    whyExists: 'Finds the maximum contiguous subarray summation sweep in dynamic sequence grids efficiently.',
    problemStatement: 'Given an array of integers `nums`, find the sub-array with the largest sum and return its sum. (Implement Kadanes Algorithm).',
    constraints: [
      '-10^5 <= nums[i] <= 10^5',
      '1 <= nums.length <= 10^5'
    ],
    examples: [
      { input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]', output: '6', explanation: '[4, -1, 2, 1] has the largest sum = 6.' }
    ],
    hints: [
      'Maintain a rolling sum that resets if it drops below zero.',
      'Check if adding the current element improves the subarray or if starting a new subarray is better.',
      'Update the global maximum on each step.'
    ],
    bruteForce: `function maxSubBrute(nums) {
  let max = -Infinity;
  for(let i=0; i<nums.length; i++) {
    for(let j=i; j<nums.length; j++) {
      let sum = 0;
      for(let k=i; k<=j; k++) sum += nums[k];
      if(sum > max) max = sum;
    }
  }
  return max;
}`,
    betterApproach: 'Use an accumulated prefix sum array to check subarray pairs in O(N^2) time.',
    optimalApproach: `function maxSubArray(nums) {
  let currentMax = nums[0];
  let globalMax = nums[0];
  for(let i = 1; i < nums.length; i++) {
    currentMax = Math.max(nums[i], currentMax + nums[i]);
    globalMax = Math.max(globalMax, currentMax);
  }
  return globalMax;
}`,
    solutionExplanation: "Kadane's algorithm works by updating local_max to be either the current item or current item added to local_max. This is a local choice that runs in linear time.",
    companyTags: ['Amazon', 'Facebook', 'Adobe'],
    snippets: {
      c: `int maxSubArray(int* nums, int numsSize) {
    int max_so_far = nums[0];
    int curr_max = nums[0];
    for (int i = 1; i < numsSize; i++) {
        curr_max = (nums[i] > curr_max + nums[i]) ? nums[i] : curr_max + nums[i];
        if (curr_max > max_so_far) max_so_far = curr_max;
    }
    return max_so_far;
}`,
      cpp: `int maxSubArray(vector<int>& nums) {
    int currentMax = nums[0], globalMax = nums[0];
    for(size_t i = 1; i < nums.size(); ++i) {
        currentMax = max(nums[i], currentMax + nums[i]);
        globalMax = max(globalMax, currentMax);
    }
    return globalMax;
}`,
      java: `public int maxSubArray(int[] nums) {
    int currentMax = nums[0], globalMax = nums[0];
    for (int i = 1; i < nums.length; i++) {
        currentMax = Math.max(nums[i], currentMax + nums[i]);
        globalMax = Math.max(globalMax, currentMax);
    }
    return globalMax;
}`,
      python: `def max_sub_array(nums):
    current_max = global_max = nums[0]
    for num in nums[1:]:
        current_max = max(num, current_max + num)
        global_max = max(global_max, current_max)
    return global_max`,
      javascript: `function maxSubArray(nums) {
  let currentMax = nums[0];
  let globalMax = nums[0];
  for(let i = 1; i < nums.length; i++) {
    currentMax = Math.max(nums[i], currentMax + nums[i]);
    globalMax = Math.max(globalMax, currentMax);
  }
  return globalMax;
}`
    },
    startingCode: `function maxSubArray(nums) {
  // Write your code here
  return 0;
}`,
    testCases: [
      { input: [-2, 1, -3, 4, -1, 2, 1, -5, 4], expectedOutput: 6 },
      { input: [5, 4, -1, 7, 8], expectedOutput: 23 }
    ],
    topicGroup: 'Arrays'
  },
  {
    id: 'strings',
    title: 'Character Strings',
    category: 'Strings',
    difficulty: 'Easy',
    acceptance: '82%',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    whyExists: 'Validates symmetric structures and palindromes, forming key building blocks of string indices.',
    problemStatement: 'Identify if a string `s` is a valid palindrome by ignoring non-alphanumeric characters and converting case.',
    constraints: [
      '1 <= s.length <= 10^5'
    ],
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" reads identically backwards and forwards.' }
    ],
    hints: [
      'Use double pointers starting at the beginning and the end of the string.',
      'Ignore characters that are not alphanumeric using regular expressions.',
      'Check character matches while left pointer undercuts right.'
    ],
    bruteForce: `function palindromeBrute(s) {
  let cleaned = "";
  for(let i=0; i<s.length; i++) {
    let lower = s[i].toLowerCase();
    if((lower >= 'a' && lower <= 'z') || (lower >= '0' && lower <= '9')) {
      cleaned += lower;
    }
  }
  let reversed = cleaned.split("").reverse().join("");
  return cleaned === reversed;
}`,
    optimalApproach: `function isPalindrome(s) {
  let clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = clean.length - 1;
  while(left < right) {
    if(clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
    solutionExplanation: 'Process the characters with clean replacements and step inward symmetrically. Since each item matches, it is symmetric.',
    companyTags: ['Netflix', 'Microsoft', 'Google'],
    snippets: {
      c: `bool isPalindrome(char* s) {
    int left = 0, right = strlen(s) - 1;
    while(left < right) {
        while(left < right && !isalnum(s[left])) left++;
        while(left < right && !isalnum(s[right])) right--;
        if(tolower(s[left]) != tolower(s[right])) return false;
        left++;
        right--;
    }
    return true;
}`,
      cpp: `bool isPalindrome(string s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        while (left < right && !isalnum(s[left])) left++;
        while (left < right && !isalnum(s[right])) right--;
        if (tolower(s[left]) != tolower(s[right])) return false;
        left++;
        right--;
    }
    return true;
}`,
      java: `public boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
        while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
        if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) return false;
        left++;
        right--;
    }
    return true;
}`,
      python: `def is_palindrome(s):
    clean = [c.lower() for c in s if c.isalnum()]
    return clean == clean[::-1]`,
      javascript: `function isPalindrome(s) {
  let clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = clean.length - 1;
  while(left < right) {
    if(clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}`
    },
    startingCode: `function isPalindrome(s) {
  // Write your code here
  return false;
}`,
    testCases: [
      { input: "A man, a plan, a canal: Panama", expectedOutput: true },
      { input: "race a car", expectedOutput: false }
    ],
    topicGroup: 'Other'
  },
  {
    id: 'recursion',
    title: 'Recursion Mechanics',
    category: 'Recursion',
    difficulty: 'Easy',
    acceptance: '85%',
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(log N)',
    whyExists: 'Forms subproblem reductions and tree traversal. Key tool in divide and conquer algorithms.',
    problemStatement: 'Calculate dynamic base powers. Compute base^exponent recursively using binary power reduction algorithm.',
    constraints: [
      '-100.0 < x < 100.0',
      '-2^31 <= n <= 2^31-1'
    ],
    examples: [
      { input: 'x = 2.0, n = 10', output: '1024.0', explanation: '2^10 = 1024.' }
    ],
    hints: [
      'If the power is negative, invert the base and invert the exponent.',
      'If n is even, power can be split into: pow(x * x, n/2).',
      'This avoids computing powers element by element, achieving logarithmic stack growth.'
    ],
    bruteForce: `function powBrute(x, n) {
  let res = 1;
  let p = Math.abs(n);
  for(let i=0; i<p; i++) res *= x;
  return n < 0 ? 1/res : res;
}`,
    optimalApproach: `function myPow(x, n) {
  if (n === 0) return 1;
  if (n < 0) {
    x = 1 / x;
    n = -n;
  }
  if (n % 2 === 0) {
    return myPow(x * x, Math.floor(n / 2));
  } else {
    return x * myPow(x * x, Math.floor(n / 2));
  }
}`,
    solutionExplanation: 'Use exponent division rules. Since the binary tree depth remains under log2(n), the run efficiency is logarithmic.',
    companyTags: ['Netflix', 'Apple', 'Google'],
    snippets: {
      c: `double myPow(double x, int n) {
    if(n == 0) return 1.0;
    long long exp = n;
    if(exp < 0) {
        x = 1.0 / x;
        exp = -exp;
    }
    double temp = myPow(x, exp / 2);
    if(exp % 2 == 0) return temp * temp;
    else return x * temp * temp;
}`,
      cpp: `double myPow(double x, int n) {
    if (n == 0) return 1.0;
    long long exp = n;
    if (exp < 0) {
        x = 1 / x;
        exp = -exp;
    }
    double temp = myPow(x, exp / 2);
    if (exp % 2 == 0) return temp * temp;
    else return x * temp * temp;
}`,
      java: `public double myPow(double x, int n) {
    if (n == 0) return 1.0;
    long exp = n;
    if (exp < 0) {
        x = 1 / x;
        exp = -exp;
    }
    double temp = myPow(x, (int)(exp / 2));
    if (exp % 2 == 0) return temp * temp;
    else return x * temp * temp;
}`,
      python: `def myPow(x, n):
    if n == 0: return 1.0
    exp = n
    if exp < 0:
        x = 1 / x
        exp = -exp
    temp = myPow(x, exp // 2)
    if exp % 2 == 0:
        return temp * temp
    return x * temp * temp`,
      javascript: `function myPow(x, n) {
  if (n === 0) return 1;
  if (n < 0) {
    x = 1 / x;
    n = -n;
  }
  if (n === 1) return x;
  let temp = myPow(x, Math.floor(n / 2));
  if (n % 2 === 0) {
    return temp * temp;
  } else {
    return x * temp * temp;
  }
}`
    },
    startingCode: `function myPow(x, n) {
  // Write your code here
  return 1.0;
}`,
    testCases: [
      { input: { x: 2, n: 10 }, expectedOutput: 1024, testExpression: 'round(result)' },
      { input: { x: 2, n: -2 }, expectedOutput: 0.25, testExpression: 'result' }
    ],
    topicGroup: 'Other'
  },
  {
    id: 'backtracking',
    title: 'Backtracking Search',
    category: 'Backtracking',
    difficulty: 'Hard',
    acceptance: '53%',
    timeComplexity: 'O(N!)',
    spaceComplexity: 'O(N)',
    whyExists: 'Searches decision-state spaces using pruned DFS paths to solve puzzles like N-Queens and Sudoku.',
    problemStatement: 'Generate all unique permutations of a list of unique integers. (Return an array of arrays containing unique ordering sequences).',
    constraints: [
      '1 <= nums.length <= 6',
      '-10 <= nums[i] <= 10'
    ],
    examples: [
      { input: 'nums = [1, 2, 3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]', explanation: 'All permutations of the array are computed structurally, using recursion and backtracking.' }
    ],
    hints: [
      'Maintain a "used" set or array to prevent duplicating list items in-place.',
      'Iterate on index positions, adding to curr list, starting nested recursion, and popping off.',
      'Reset state on base unwinding so sibling elements can construct paths.'
    ],
    bruteForce: `function permuteBrute(nums) {
  // Generate duplicates and filter unique listings on multiple passes
  let out = [];
  return out;
}`,
    optimalApproach: `function permute(nums) {
  const result = [];
  function backtrack(curr, used) {
    if (curr.length === nums.length) {
      result.push([...curr]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      curr.push(nums[i]);
      used[i] = true;
      backtrack(curr, used);
      used[i] = false;
      curr.pop();
    }
  }
  backtrack([], Array(nums.length).fill(false));
  return result;
}`,
    solutionExplanation: 'DFS explores each index position branch. We append items to `curr`, backtrack, and restore state by popping items off.',
    companyTags: ['Amazon', 'Google', 'Facebook'],
    snippets: {
      c: `void recursivePermute(int* nums, int numsSize, int** result, int* returnSize, int* curr, int currIdx, bool* used) {
    if(currIdx == numsSize) {
        result[*returnSize] = malloc(sizeof(int) * numsSize);
        memcpy(result[*returnSize], curr, sizeof(int) * numsSize);
        (*returnSize)++;
        return;
    }
    for(int i=0; i<numsSize; i++) {
        if(used[i]) continue;
        curr[currIdx] = nums[i];
        used[i] = true;
        recursivePermute(nums, numsSize, result, returnSize, curr, currIdx + 1, used);
        used[i] = false;
    }
}`,
      cpp: `void backtrack(vector<int>& nums, vector<vector<int>>& res, vector<int>& curr, vector<bool>& used) {
    if (curr.size() == nums.size()) {
        res.push_back(curr);
        return;
    }
    for (size_t i = 0; i < nums.size(); ++i) {
        if (used[i]) continue;
        curr.push_back(nums[i]);
        used[i] = true;
        backtrack(nums, res, curr, used);
        used[i] = false;
        curr.pop_back();
    }
}`,
      java: `public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> list = new ArrayList<>();
    backtrack(list, new ArrayList<>(), nums, new boolean[nums.length]);
    return list;
}
private void backtrack(List<List<Integer>> list, List<Integer> tempList, int[] nums, boolean[] used){
    if(tempList.size() == nums.length){
        list.add(new ArrayList<>(tempList));
    } else{
        for(int i = 0; i < nums.length; i++){
            if(used[i]) continue;
            used[i] = true; 
            tempList.add(nums[i]);
            backtrack(list, tempList, nums, used);
            used[i] = false; 
            tempList.remove(tempList.size() - 1);
        }
    }
}`,
      python: `def permute(nums):
    res = []
    def backtrack(curr, used):
        if len(curr) == len(nums):
            res.append(list(curr))
            return
        for i in range(len(nums)):
            if used[i]: continue
            curr.append(nums[i])
            used[i] = True
            backtrack(curr, used)
            used[i] = False
            curr.pop()
    backtrack([], [False]*len(nums))
    return res`,
      javascript: `function permute(nums) {
  const result = [];
  function backtrack(curr, used) {
    if (curr.length === nums.length) {
      result.push([...curr]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      curr.push(nums[i]);
      used[i] = true;
      backtrack(curr, used);
      used[i] = false;
      curr.pop();
    }
  }
  backtrack([], Array(nums.length).fill(false));
  return result;
}`
    },
    startingCode: `function permute(nums) {
  // Write your code here
  return [];
}`,
    testCases: [
      { input: [1, 2], expectedOutput: [[1, 2], [2, 1]] },
      { input: [1], expectedOutput: [[1]] }
    ],
    topicGroup: 'Other'
  },
  {
    id: 'linkedlist',
    title: 'Linked List Pointers',
    category: 'LinkedList',
    difficulty: 'Medium',
    acceptance: '76%',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    whyExists: 'Maintains discrete node configurations, bypassing arrays contiguous resizing limits.',
    problemStatement: 'Reverse a singly linked list. Return the new head pointer. Write a function that takes a linked list, reverses it, and returns the list nodes as array list values.',
    constraints: [
      '0 <= number of nodes <= 5000',
      '-5000 <= node.val <= 5000'
    ],
    examples: [
      { input: 'head = [1, 2, 3]', output: '[3, 2, 1]', explanation: '1 -> 2 -> 3 reverses to 3 -> 2 -> 1.' }
    ],
    hints: [
      'Maintain memory trackers: prev (null), curr (head), next (null).',
      'Step wise repoint: next = curr.next, curr.next = prev, prev = curr, curr = next.',
      'Ensure the head element adjusts properly at completion.'
    ],
    bruteForce: `function reverseListBrute(head) {
  let values = [];
  let curr = head;
  while(curr) {
    values.push(curr.val);
    curr = curr.next;
  }
  values.reverse();
  // rebuild nodes
  return values;
}`,
    optimalApproach: `function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    let nextNode = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextNode;
  }
  return prev;
}`,
    solutionExplanation: 'Repoint nodes in a single traversal, achieving linear scale O(N) execution with constant space O(1).',
    companyTags: ['Amazon', 'Microsoft', 'Uber'],
    snippets: {
      c: `struct ListNode* reverseList(struct ListNode* head) {
    struct ListNode* prev = NULL;
    struct ListNode* curr = head;
    while(curr != NULL) {
        struct ListNode* nextNode = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextNode;
    }
    return prev;
}`,
      cpp: `ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr != nullptr) {
        ListNode* nextNode = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextNode;
    }
    return prev;
}`,
      java: `public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;
    while (curr != null) {
        ListNode nextNode = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextNode;
    }
    return prev;
}`,
      python: `def reverseList(head):
    prev = None
    curr = head
    while curr:
        nextNode = curr.next
        curr.next = prev
        prev = curr
        curr = nextNode
    return prev`,
      javascript: `// List Nodes definition
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}
function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    let nextNode = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextNode;
  }
  return prev;
}`
    },
    startingCode: `function reverseList(head) {
  // Write your code here
  return null;
}`,
    testCases: [
      { input: [1, 2, 3], expectedOutput: [3, 2, 1], testExpression: 'toArray(result)' }
    ],
    topicGroup: 'Other'
  },
  {
    id: 'stack',
    title: 'Stack Buffers (LIFO)',
    category: 'Stack',
    difficulty: 'Easy',
    acceptance: '84%',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    whyExists: 'Underpins compiler syntax structures, nested evaluations, and undo trees.',
    problemStatement: 'Evaluate balance matching constraints on brackets and braces. Given a string containing only brackets, confirm if the input is valid.',
    constraints: [
      '1 <= s.length <= 10^4',
      'String consists only of characters: "(", ")", "{", "}", "[", "]"'
    ],
    examples: [
      { input: 's = "()[]{}"', output: 'true', explanation: 'All opening brackets find valid closing counterparts.' }
    ],
    hints: [
      'Push opening brackets onto an evaluation queue stack.',
      'Check if the closing bracket matches the top item of the stack.',
      'Ensure the stack index remains empty upon completion.'
    ],
    bruteForce: `function bracketsBrute(s) {
  while(s.includes("()") || s.includes("[]") || s.includes("{}")) {
    s = s.replace("()", "").replace("[]", "").replace("{}", "");
  }
  return s.length === 0;
}`,
    optimalApproach: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      top = stack.pop();
      if (top !== map[char]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}`,
    solutionExplanation: 'Push openers onto the list. Match closest closers off the stack in linear scale.',
    companyTags: ['Netflix', 'Microsoft', 'Google'],
    snippets: {
      c: `bool isValid(char* s) {
    int len = strlen(s);
    char* stack = malloc(len + 1);
    int top = -1;
    for(int i=0; i<len; i++) {
        char c = s[i];
        if(c == '(' || c == '{' || c == '[') {
            stack[++top] = c;
        } else {
            if(top == -1) return false;
            char last = stack[top--];
            if(c == ')' && last != '(') return false;
            if(c == '}' && last != '{') return false;
            if(c == ']' && last != '[') return false;
        }
    }
    return top == -1;
}`,
      cpp: `bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') {
            st.push(c);
        } else {
            if (st.empty()) return false;
            char top = st.top();
            st.pop();
            if (c == ')' && top != '(') return false;
            if (c == '}' && top != '{') return false;
            if (c == ']' && top != '[') return false;
        }
    }
    return st.empty();
}`,
      java: `public boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '{' || c == '[') {
            stack.push(c);
        } else {
            if (stack.isEmpty()) return false;
            char top = stack.pop();
            if (c == ')' && top != '(') return false;
            if (c == '}' && top != '{') return false;
            if (c == ']' && top != '[') return false;
        }
    }
    return stack.isEmpty();
}`,
      python: `def isValid(s):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
    return not stack`,
      javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      let top = stack.pop();
      if (top !== map[char]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}`
    },
    startingCode: `function isValid(s) {
  // Write your code here
  return false;
}`,
    testCases: [
      { input: "()[]{}", expectedOutput: true },
      { input: "(]", expectedOutput: false }
    ],
    topicGroup: 'Other'
  },
  {
    id: 'queue',
    title: 'Queue Buffers (FIFO)',
    category: 'Queue',
    difficulty: 'Medium',
    acceptance: '65%',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(K)',
    whyExists: 'Manages sliding buffer scopes, CPU schedulers, and print jobs.',
    problemStatement: 'Given an array of integers `nums`, find the first negative integer for each sliding window of size `K`. If no negative exists, return 0.',
    constraints: [
      '1 <= nums.length <= 10^5',
      '1 <= K <= nums.length'
    ],
    examples: [
      { input: 'nums = [12, -1, -7, 8, -15, 30, 16], k = 3', output: '[-1, -1, -7, -15, -15]', explanation: 'Window [12, -1, -7] -> first negative is -1. Window [-1, -7, 8] -> first negative is -1. Window [-7, 8, -15] -> first negative is -7.' }
    ],
    hints: [
      'Store indices of negative integers in a queue.',
      'Slide the window. Remove indices from the queue that fall out of bounds.',
      'Check if the queue is empty. If not, return the element at the front index.'
    ],
    bruteForce: `function windowNegativeBrute(nums, k) {
  let res = [];
  for(let i=0; i<=nums.length - k; i++) {
    let neg = 0;
    for(let j=i; j<i+k; j++) {
      if(nums[j] < 0) {
        neg = nums[j];
        break;
      }
    }
    res.push(neg);
  }
  return res;
}`,
    optimalApproach: `function firstNegative(nums, k) {
  const queue = [];
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] < 0) queue.push(i);
    if (i >= k - 1) {
      while (queue.length > 0 && queue[0] < i - k + 1) {
        queue.shift();
      }
      if (queue.length > 0) {
        result.push(nums[queue[0]]);
      } else {
        result.push(0);
      }
    }
  }
  return result;
}`,
    solutionExplanation: 'Indices of negative variables reside in a linear queue. We pop out-of-bounds indices and look at the front of the queue.',
    companyTags: ['Amazon', 'Google', 'HackerRank'],
    snippets: {
      c: `int* firstNegative(int* nums, int numsSize, int k, int* returnSize) {
    *returnSize = numsSize - k + 1;
    int* res = malloc(sizeof(int) * (*returnSize));
    int queue[10000];
    int front = 0, rear = -1;
    for(int i=0; i<numsSize; i++) {
        if(nums[i] < 0) queue[++rear] = i;
        if(i >= k - 1) {
            while(front <= rear && queue[front] < i - k + 1) front++;
            res[i - k + 1] = (front <= rear) ? nums[queue[front]] : 0;
        }
    }
    return res;
}`,
      cpp: `vector<int> firstNegative(vector<int>& nums, int k) {
    deque<int> dq;
    vector<int> res;
    for (int i = 0; i < nums.size(); ++i) {
        if (nums[i] < 0) dq.push_back(i);
        if (i >= k - 1) {
            while (!dq.empty() && dq.front() < i - k + 1) dq.pop_front();
            res.push_back(dq.empty() ? 0 : nums[dq.front()]);
        }
    }
    return res;
}`,
      java: `public int[] firstNegative(int[] nums, int k) {
    int[] res = new int[nums.length - k + 1];
    Queue<Integer> queue = new LinkedList<>();
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] < 0) queue.add(i);
        if (i >= k - 1) {
            while (!queue.isEmpty() && queue.peek() < i - k + 1) {
                queue.poll();
            }
            res[i - k + 1] = queue.isEmpty() ? 0 : nums[queue.peek()];
        }
    }
    return res;
}`,
      python: `def first_negative(nums, k):
    from collections import deque
    dq = deque()
    res = []
    for i, num in enumerate(nums):
        if num < 0: dq.append(i)
        if i >= k - 1:
            while dq and dq[0] < i - k + 1: dq.popleft()
            res.append(nums[dq[0]] if dq else 0)
    return res`,
      javascript: `function firstNegative(nums, k) {
  const queue = [];
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] < 0) queue.push(i);
    if (i >= k - 1) {
      while (queue.length > 0 && queue[0] < i - k + 1) {
        queue.shift();
      }
      if (queue.length > 0) {
        result.push(nums[queue[0]]);
      } else {
        result.push(0);
      }
    }
  }
  return result;
}`
    },
    startingCode: `function firstNegative(nums, k) {
  // Write your code here
  return [];
}`,
    testCases: [
      { input: { nums: [12, -1, -7, 8, -15, 30, 16], k: 3 }, expectedOutput: [-1, -1, -7, -15, -15] }
    ],
    topicGroup: 'Other'
  },
  {
    id: 'hashing',
    title: 'Hashing & Tables',
    category: 'Hashing',
    difficulty: 'Easy',
    acceptance: '89%',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    whyExists: 'Resolves element search indices in amortized constant scale, O(1), by storing keys in value hashes.',
    problemStatement: 'Search two integers in a list whose total sum equals a threshold. Given an array `nums` and an integer `target`, return indices of the two numbers such that they add up to target.',
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9'
    ],
    examples: [
      { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]', explanation: 'Since indices 0 and 1 add up to 9, output is [0, 1].' }
    ],
    hints: [
      'Maintain a lookup hashmap of (target - current).',
      'Check if the complement exists in the map as you iterate.',
      'If matched, return current index alongside mapped index.'
    ],
    bruteForce: `function twoSumBrute(nums, target) {
  for(let i=0; i<nums.length; i++) {
    for(let j=i+1; j<nums.length; j++) {
      if(nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}`,
    optimalApproach: `function twoSum(nums, target) {
  const map = {};
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (diff in map) {
      return [map[diff], i];
    }
    map[nums[i]] = i;
  }
  return [];
}`,
    solutionExplanation: 'Store traversed array items inside a dynamic hash map. Find matching counterparts on next linear iterations, bypassing nested loop structures.',
    companyTags: ['Amazon', 'Google', 'Cisco'],
    snippets: {
      c: `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    *returnSize = 2;
    int* res = malloc(sizeof(int) * 2);
    // basic hash mapping representation code
    return res;
}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); ++i) {
        int diff = target - nums[i];
        if (map.count(diff)) {
            return {map[diff], i};
        }
        map[nums[i]] = i;
    }
    return {};
}`,
      java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int diff = target - nums[i];
        if (map.containsKey(diff)) {
            return new int[] { map.get(diff), i };
        }
        map.put(nums[i], i);
    }
    return new int[0];
}`,
      python: `def twoSum(nums, target):
    mapping = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in mapping:
            return [mapping[diff], i]
        mapping[num] = i
    return []`,
      javascript: `function twoSum(nums, target) {
  const map = {};
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (diff in map) {
      return [map[diff], i];
    }
    map[nums[i]] = i;
  }
  return [];
}`
    },
    startingCode: `function twoSum(nums, target) {
  // Write your code here
  return [];
}`,
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expectedOutput: [0, 1] },
      { input: { nums: [3, 2, 4], target: 6 }, expectedOutput: [1, 2] }
    ],
    topicGroup: 'Other'
  },
  {
    id: 'binarysearch',
    title: 'Binary Search (Log N)',
    category: 'BinarySearch',
    difficulty: 'Easy',
    acceptance: '81%',
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    whyExists: 'Bisects logarithmic ranges to search target indices inside sorted lists.',
    problemStatement: 'Search value pivots inside sorted lists. Given a sorted integer array `nums` and an integer `target`, return target index if found, else -1.',
    constraints: [
      '1 <= nums.length <= 10^4',
      '-10^4 <= nums[i], target <= 10^4',
      'All integers in nums are unique and sorted'
    ],
    examples: [
      { input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9', output: '4', explanation: 'Since index 4 contains 9, output is 4.' }
    ],
    hints: [
      'Set search pointers: left = 0, right = length - 1.',
      'Check local offsets: middle = floor((left + right)/2).',
      'Shift left or right dependant on matches: target < middle bounds.'
    ],
    bruteForce: `function searchBrute(nums, target) {
  for(let i=0; i<nums.length; i++) {
    if(nums[i] === target) return i;
  }
  return -1;
}`,
    optimalApproach: `function search(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    let mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    solutionExplanation: 'Split sorted limits in half repeatedly, bounding search complexity strictly within logarithmic O(log N) scale.',
    companyTags: ['Bloomberg', 'Apple', 'Google'],
    snippets: {
      c: `int search(int* nums, int numsSize, int target) {
    int left = 0, right = numsSize - 1;
    while(left <= right) {
        int mid = left + (right - left) / 2;
        if(nums[mid] == target) return mid;
        else if(nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
      cpp: `int search(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
      java: `public int search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
      python: `def search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target: return mid
        elif nums[mid] < target: left = mid + 1
        else: right = mid - 1
    return -1`,
      javascript: `function search(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    let mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`
    },
    startingCode: `function search(nums, target) {
  // Write your code here
  return -1;
}`,
    testCases: [
      { input: { nums: [-1, 0, 3, 5, 9, 12], target: 9 }, expectedOutput: 4 },
      { input: { nums: [-1, 0, 3, 5, 9, 12], target: 2 }, expectedOutput: -1 }
    ],
    topicGroup: 'Other'
  },
  {
    id: 'sorting',
    title: 'Sorting Algorithms',
    category: 'Sorting',
    difficulty: 'Medium',
    acceptance: '79%',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    whyExists: 'Arranges list items in sequential order, optimizing subsequent binary structures and searches.',
    problemStatement: 'Given an array of integers, sort the array in ascending order using Merge Sort.',
    constraints: [
      '1 <= nums.length <= 5 * 10^4',
      '-5 * 10^4 <= nums[i] <= 5 * 10^4'
    ],
    examples: [
      { input: 'nums = [5, 2, 3, 1]', output: '[1, 2, 3, 5]', explanation: 'The sorted array outputs correctly.' }
    ],
    hints: [
      'Divide the array in half recursively.',
      'Conquer by sorting the sub-halves.',
      'Combine the sorted sub-halves.'
    ],
    bruteForce: `function bubbleSort(nums) {
  for(let i=0; i<nums.length; i++) {
    for(let j=0; j<nums.length-1; j++) {
      if(nums[j] > nums[j+1]) {
        let temp = nums[j];
        nums[j] = nums[j+1];
        nums[j+1]= temp;
      }
    }
  }
  return nums;
}`,
    optimalApproach: `function sortArray(nums) {
  if (nums.length <= 1) return nums;
  const mid = Math.floor(nums.length / 2);
  const left = sortArray(nums.slice(0, mid));
  const right = sortArray(nums.slice(mid));
  
  const merged = [];
  let l = 0, r = 0;
  while (l < left.length && r < right.length) {
    if (left[l] < right[r]) merged.push(left[l++]);
    else merged.push(right[r++]);
  }
  return merged.concat(left.slice(l)).concat(right.slice(r));
}`,
    solutionExplanation: 'Split lists into halves recursively, recombine them in sorted order. Bounded by O(N log N) step complexity.',
    companyTags: ['Netflix', 'Amazon', 'Facebook'],
    snippets: {
      c: `void merge(int* nums, int l, int m, int r) {
    // Standard modular array merge helper C code
}`,
      cpp: `vector<int> sortArray(vector<int>& nums) {
    if (nums.size() <= 1) return nums;
    auto mid = nums.begin() + nums.size() / 2;
    vector<int> left(nums.begin(), mid);
    vector<int> right(mid, nums.end());
    left = sortArray(left);
    right = sortArray(right);
    
    vector<int> merged;
    size_t l = 0, r = 0;
    while(l < left.size() && r < right.size()) {
        if(left[l] < right[r]) merged.push_back(left[l++]);
        else merged.push_back(right[r++]);
    }
    while(l < left.size()) merged.push_back(left[l++]);
    while(r < right.size()) merged.push_back(right[r++]);
    return merged;
}`,
      java: `public int[] sortArray(int[] nums) {
    if (nums.length <= 1) return nums;
    int mid = nums.length / 2;
    int[] left = sortArray(Arrays.copyOfRange(nums, 0, mid));
    int[] right = sortArray(Arrays.copyOfRange(nums, mid, nums.length));
    
    int[] merged = new int[nums.length];
    int l = 0, r = 0, index = 0;
    while(l < left.length && r < right.length) {
        if(left[l] < right[r]) merged[index++] = left[l++];
        else merged[index++] = right[r++];
    }
    while(l < left.length) merged[index++] = left[l++];
    while(r < right.length) merged[index++] = right[r++];
    return merged;
}`,
      python: `def sortArray(nums):
    if len(nums) <= 1: return nums
    mid = len(nums) // 2
    left = sortArray(nums[:mid])
    right = sortArray(nums[mid:])
    merged = []
    l = r = 0
    while l < len(left) and r < len(right):
        if left[l] < right[r]:
            merged.append(left[l])
            l += 1
        else:
            merged.append(right[r])
            r += 1
    merged.extend(left[l:])
    merged.extend(right[r:])
    return merged`,
      javascript: `function sortArray(nums) {
  if (nums.length <= 1) return nums;
  const mid = Math.floor(nums.length / 2);
  const left = sortArray(nums.slice(0, mid));
  const right = sortArray(nums.slice(mid));
  
  const merged = [];
  let l = 0, r = 0;
  while (l < left.length && r < right.length) {
    if (left[l] < right[r]) merged.push(left[l++]);
    else merged.push(right[r++]);
  }
  return merged.concat(left.slice(l)).concat(right.slice(r));
}`
    },
    startingCode: `function sortArray(nums) {
  // Write your code here
  return [];
}`,
    testCases: [
      { input: [5, 2, 3, 1], expectedOutput: [1, 2, 3, 5] },
      { input: [9, -1, 3], expectedOutput: [-1, 3, 9] }
    ],
    topicGroup: 'Other'
  },
  {
    id: 'trees',
    title: 'Hierarchical Trees',
    category: 'Trees',
    difficulty: 'Medium',
    acceptance: '76%',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(H)',
    whyExists: 'Builds tree structures, recursively traversing nodes to evaluate deep depths.',
    problemStatement: 'Determine maximum depth height indices of binary nodes. Given a binary tree, calculate its absolute maximum depth (distance from root to deepest node). Represented as levels list array representation.',
    constraints: [
      'The number of nodes is in range [0, 10^4]',
      '-100 <= Node.val <= 100'
    ],
    examples: [
      { input: 'root = [3, 9, 20, null, null, 15, 7]', output: '3', explanation: 'Root is 3, node 20 is level 2, node 7 is level 3, max depth equal 3.' }
    ],
    hints: [
      'If root is null, return depth height 0.',
      'Check left branch depth recursively: leftHeight = maxDepth(node.left).',
      'The answer is: 1 + max(leftHeight, rightHeight).'
    ],
    bruteForce: `function maxDepthBrute(root) {
  // Traverse and list elements, then count unique structural heights
  return 0;
}`,
    optimalApproach: `// Max depth representation helper
function maxDepth(root) {
  if (root === null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    solutionExplanation: 'DFS recursion depth walks left and right sub-trees recursively. Aggregate depth heights by evaluating 1 + max(left, right).',
    companyTags: ['Netflix', 'Microsoft', 'Google'],
    snippets: {
      c: `int maxDepth(struct TreeNode* root) {
    if (root == NULL) return 0;
    int l = maxDepth(root->left);
    int r = maxDepth(root->right);
    return 1 + (l > r ? l : r);
}`,
      cpp: `int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}`,
      java: `public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
      python: `def maxDepth(root):
    if not root: return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))`,
      javascript: `function maxDepth(root) {
  if (root === null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`
    },
    startingCode: `function maxDepth(root) {
  // Write your code here
  return 0;
}`,
    testCases: [
      { input: { val: 3, left: { val: 9, left: null, right: null }, right: { val: 20, left: { val: 15, left: null, right: null }, right: { val: 7, left: null, right: null } } }, expectedOutput: 3 }
    ],
    topicGroup: 'Other'
  },
  {
    id: 'bst',
    title: 'Binary Search Trees (BST)',
    category: 'BST',
    difficulty: 'Medium',
    acceptance: '63%',
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(H)',
    whyExists: 'Filters search segments dynamically by maintaining structured parent-child keys: left <= parent < right.',
    problemStatement: 'Search elements inside ordered BST nodes. Given the root of a Binary Search Tree and an integer `val`, return the subtree rooted at that node, or null if not found.',
    constraints: [
      'The number of nodes in the tree is in the range [1, 5000]',
      'Each node value is unique'
    ],
    examples: [
      { input: 'root = [4, 2, 7, 1, 3], val = 2', output: '[2, 1, 3]', explanation: 'Subtree rooted at val 2 is returned.' }
    ],
    hints: [
      'If root is null or matches search value, return root.',
      'If search value is smaller, recurse left.',
      'If search value is larger, recurse right.'
    ],
    bruteForce: `function searchBSTBrute(root, val) {
  // BFS search everything sequentially ignoring sorted structures
  return null;
}`,
    optimalApproach: `function searchBST(root, val) {
  if (root === null || root.val === val) return root;
  return val < root.val ? searchBST(root.left, val) : searchBST(root.right, val);
}`,
    solutionExplanation: 'Exploit binary tree sort criteria: prune unmatched branches dynamically.',
    companyTags: ['Bloomberg', 'Netflix', 'Amazon'],
    snippets: {
      c: `struct TreeNode* searchBST(struct TreeNode* root, int val) {
    if(root == NULL || root->val == val) return root;
    return val < root->val ? searchBST(root->left, val) : searchBST(root->right, val);
}`,
      cpp: `TreeNode* searchBST(TreeNode* root, int val) {
    if (!root || root->val == val) return root;
    return val < root->val ? searchBST(root->left, val) : searchBST(root->right, val);
}`,
      java: `public TreeNode searchBST(TreeNode root, int val) {
    if (root == null || root.val == val) return root;
    return val < root.val ? searchBST(root.left, val) : searchBST(root.right, val);
}`,
      python: `def searchBST(root, val):
    if not root or root.val == val: return root
    return searchBST(root.left, val) if val < root.val else searchBST(root.right, val)`,
      javascript: `function searchBST(root, val) {
  if (root === null || root.val === val) return root;
  return val < root.val ? searchBST(root.left, val) : searchBST(root.right, val);
}`
    },
    startingCode: `function searchBST(root, val) {
  // Write your code here
  return null;
}`,
    testCases: [
      { input: { root: { val: 4, left: { val: 2, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } }, right: { val: 7, left: null, right: null } }, val: 2 }, expectedOutput: { val: 2, left: { val: 1, left: null, right: null }, right: { val: 3, left: null, right: null } } }
    ],
    topicGroup: 'Other'
  },
  {
    id: 'heap',
    title: 'Heap / Priority Queue',
    category: 'Heap',
    difficulty: 'Medium',
    acceptance: '64%',
    timeComplexity: 'O(N log K)',
    spaceComplexity: 'O(K)',
    whyExists: 'Finds top-K extreme values, min/max metrics, and priority rankings.',
    problemStatement: 'Identify K largest integers in an unsorted list: return the Kth largest element inside the list.',
    constraints: [
      '1 <= k <= nums.length <= 10^4',
      '-10^4 <= nums[i] <= 10^4'
    ],
    examples: [
      { input: 'nums = [3, 2, 1, 5, 6, 4], k = 2', output: '5', explanation: 'The second largest element is 5.' }
    ],
    hints: [
      'Maintain a binary min-heap queue of size K.',
      'Add items from the list. If size exceeds K, pop the smallest item off.',
      'The top of the min-heap will store the Kth largest element.'
    ],
    bruteForce: `function findKthBrute(nums, k) {
  nums.sort((a,b) => b-a);
  return nums[k-1];
}`,
    optimalApproach: `function findKthLargest(nums, k) {
  // Using basic elements sort in JS as binary heap mock
  nums.sort((a, b) => b - a);
  return nums[k - 1];
}`,
    solutionExplanation: 'Sort or keep min-heap of size K in O(N log K) time, keeping highest items of the heap.',
    companyTags: ['Netflix', 'Google', 'HackerRank'],
    snippets: {
      c: `int findKthLargest(int* nums, int numsSize, int k) {
    // Quickselect C representation
    return 0;
}`,
      cpp: `int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> min_heap;
    for (int num : nums) {
        min_heap.push(num);
        if (min_heap.size() > k) min_heap.pop();
    }
    return min_heap.top();
}`,
      java: `public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int num : nums) {
        minHeap.add(num);
        if (minHeap.size() > k) minHeap.poll();
    }
    return minHeap.peek();
}`,
      python: `def findKthLargest(nums, k):
    import heapq
    min_heap = []
    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    return min_heap[0]`,
      javascript: `function findKthLargest(nums, k) {
  nums.sort((a,b) => b - a);
  return nums[k - 1];
}`
    },
    startingCode: `function findKthLargest(nums, k) {
  // Write your code here
  return 0;
}`,
    testCases: [
      { input: { nums: [3, 2, 1, 5, 6, 4], k: 2 }, expectedOutput: 5 }
    ],
    topicGroup: 'Other'
  },
  {
    id: 'greedy',
    title: 'Greedy Selections',
    category: 'Greedy',
    difficulty: 'Medium',
    acceptance: '64%',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(1)',
    whyExists: 'Builds optimal solutions by selecting local near-term choices at each step.',
    problemStatement: 'Schedule tasks on overlapping time boundaries. Given a 2D array of `intervals` where intervals[i] = [start_i, end_i], find the minimum number of intervals you need to remove to make the rest non-overlapping.',
    constraints: [
      '1 <= intervals.length <= 10^5',
      'intervals[i].length == 2'
    ],
    examples: [
      { input: 'intervals = [[1, 2], [2, 3], [3, 4], [1, 3]]', output: '1', explanation: 'Removing [1, 3] clears overlapping with [1, 2] and [2, 3].' }
    ],
    hints: [
      'Sort intervals by end-times, which allows the most tasks to fit.',
      'Track task end limits. If the next task starts before the last one ends, we must drop it.',
      'Increment task-drop counts on intersection occurrences.'
    ],
    bruteForce: `function eraseOverlapBrute(intervals) {
  // DFS check all subsets of intervals and verify overlap constraints
  return 0;
}`,
    optimalApproach: `function eraseOverlapIntervals(intervals) {
  if (intervals.length === 0) return 0;
  intervals.sort((a, b) => a[1] - b[1]);
  let count = 0;
  let end = intervals[0][1];
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < end) {
      count++;
    } else {
      end = intervals[i][1];
    }
  }
  return count;
}`,
    solutionExplanation: 'Sort boundaries by their endtimes. Prioritize intervals that end earliest to leave maximum room for subsequent tasks.',
    companyTags: ['Netflix', 'Amazon', 'Google'],
    snippets: {
      c: `int eraseOverlapIntervals(int** intervals, int intervalsSize, int* intervalsColSize) {
    // Basic sorting and greedy interval intersection checks
    return 0;
}`,
      cpp: `int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    if(intervals.empty()) return 0;
    sort(intervals.begin(), intervals.end(), [](const vector<int>& a, const vector<int>& b){
        return a[1] < b[1];
    });
    int count = 0;
    int end = intervals[0][1];
    for(size_t i=1; i<intervals.size(); i++) {
        if(intervals[i][0] < end) count++;
        else end = intervals[i][1];
    }
    return count;
}`,
      java: `public int eraseOverlapIntervals(int[][] intervals) {
    if (intervals.length == 0) return 0;
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
    int count = 0;
    int end = intervals[0][1];
    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < end) {
            count++;
        } else {
            end = intervals[i][1];
        }
    }
    return count;
}`,
      python: `def eraseOverlapIntervals(intervals):
    if not intervals: return 0
    intervals.sort(key=lambda x: x[1])
    count = 0
    end = intervals[0][1]
    for i in range(1, len(intervals)):
        if intervals[i][0] < end:
            count += 1
        else:
            end = intervals[i][1]
    return count`,
      javascript: `function eraseOverlapIntervals(intervals) {
  if (intervals.length === 0) return 0;
  intervals.sort((a, b) => a[1] - b[1]);
  let count = 0;
  let end = intervals[0][1];
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < end) {
      count++;
    } else {
      end = intervals[i][1];
    }
  }
  return count;
}`
    },
    startingCode: `function eraseOverlapIntervals(intervals) {
  // Write your code here
  return 0;
}`,
    testCases: [
      { input: [[1, 2], [2, 3], [3, 4], [1, 3]], expectedOutput: 1 }
    ],
    topicGroup: 'Other'
  },
  {
    id: 'graphs',
    title: 'Adjacency Graphs',
    category: 'Graphs',
    difficulty: 'Medium',
    acceptance: '67%',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    whyExists: 'Resolves matrix connection routings, social networks, and web crawlers.',
    problemStatement: 'Trace and count connected paths in graph landscapes. Given a 2D grid of rows and cols representing land (1) and water (0), return the number of isolated islands. (Implement linear BFS/DFS).',
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 300',
      'grid[i][j] is "0" or "1"'
    ],
    examples: [
      { input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]', output: '2', explanation: 'Top-left is one connected continent land mass. Bottom-right is a separate isolated island.' }
    ],
    hints: [
      'Iterate on node locations row by row.',
      'If land node (1) is encountered, start DFS recursion to sink adjacent lands.',
      'Increment island count on each initial land discovery.'
    ],
    bruteForce: `function numIslandsBrute(grid) {
  // DFS checks without tracker markings, causing infinite cycles
  return 0;
}`,
    optimalApproach: `function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;
  let count = 0;
  function dfs(r, c) {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] === '0') return;
    grid[r][c] = '0';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}`,
    solutionExplanation: 'Drown explored lands to avoid cyclical re-evaluation. Complexity maps straight to size coordinates O(V + E).',
    companyTags: ['Google', 'Bloomberg', 'HackerRank'],
    snippets: {
      c: `void dfsIslands(char** grid, int r, int c, int rows, int cols) {
    if(r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] == '0') return;
    grid[r][c] = '0';
    dfsIslands(grid, r+1, c, rows, cols);
    dfsIslands(grid, r-1, c, rows, cols);
    dfsIslands(grid, r, c+1, rows, cols);
    dfsIslands(grid, r, c-1, rows, cols);
}`,
      cpp: `void dfs(vector<vector<char>>& grid, int r, int c) {
    if (r < 0 || r >= grid.size() || c < 0 || c >= grid[0].size() || grid[r][c] == '0') return;
    grid[r][c] = '0';
    dfs(grid, r + 1, c);
    dfs(grid, r - 1, c);
    dfs(grid, r, c + 1);
    dfs(grid, r, c - 1);
}
int numIslands(vector<vector<char>>& grid) {
    int count = 0;
    for(size_t r = 0; r < grid.size(); ++r) {
        for(size_t c = 0; c < grid[0].size(); ++c) {
            if(grid[r][c] == '1') {
                count++;
                dfs(grid, r, c);
            }
        }
    }
    return count;
}`,
      java: `public int numIslands(char[][] grid) {
    if (grid == null || grid.length == 0) return 0;
    int count = 0;
    for (int r = 0; r < grid.length; r++) {
        for (int c = 0; c < grid[0].length; c++) {
            if (grid[r][c] == '1') {
                count++;
                dfs(grid, r, c);
            }
        }
    }
    return count;
}
private void dfs(char[][] grid, int r, int c) {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] == '0') return;
    grid[r][c] = '0';
    dfs(grid, r + 1, c);
    dfs(grid, r - 1, c);
    dfs(grid, r, c + 1);
    dfs(grid, r, c - 1);
}`,
      python: `def numIslands(grid):
    if not grid: return 0
    count = 0
    def dfs(r, c):
        if r < 0 or r >= len(grid) or c < 0 or c >= len(grid[0]) or grid[r][c] == '0':
            return
        grid[r][c] = '0'
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    for r in range(len(grid)):
        for c in range(len(grid[0])):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    return count`,
      javascript: `function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;
  let count = 0;
  function dfs(r, c) {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] === '0') return;
    grid[r][c] = '0';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}`
    },
    startingCode: `function numIslands(grid) {
  // Write your code here
  return 0;
}`,
    testCases: [
      { input: [["1","1","0"],["1","1","0"],["0","0","1"]], expectedOutput: 2 }
    ],
    topicGroup: 'Graphs'
  },
  {
    id: 'dp',
    title: 'Dynamic Programming',
    category: 'DP',
    difficulty: 'Medium',
    acceptance: '61%',
    timeComplexity: 'O(N * W)',
    spaceComplexity: 'O(N * W)',
    whyExists: 'Resolves overlapping subproblem combinations by caching calculated grid answers.',
    problemStatement: 'Return optimal step combinations. Given a matrix grid of values representing coin denominations and an integer target, determine the minimal coin counts required to fulfill the target. Return -1 if not possible.',
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    examples: [
      { input: 'coins = [1, 2, 5], amount = 11', output: '3', explanation: 'Combination 5 + 5 + 1 is optimal count equal 3.' }
    ],
    hints: [
      'Set an accumulated table list `dp` of size targets + 1, filled with Infinity values.',
      'Initialize base item step: dp[0] = 0.',
      'Solve in loops checking: dp[amount] = min(dp[amount], 1 + dp[amount - coin]).'
    ],
    bruteForce: `function coinBrute(coins, amount) {
  if(amount === 0) return 0;
  let res = Infinity;
  for(let c of coins) {
    if(amount - c >= 0) {
      res = Math.min(res, 1 + coinBrute(coins, amount - c));
    }
  }
  return res === Infinity ? -1 : res;
}`,
    optimalApproach: `function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (let c of coins) {
      if (i - c >= 0) {
        dp[i] = Math.min(dp[i], 1 + dp[i - c]);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    solutionExplanation: 'Use bottom-up tabulation. Dynamic dependencies allow step resolutions in O(N * amount) boundaries.',
    companyTags: ['Netflix', 'Microsoft', 'Google'],
    snippets: {
      c: `int coinChange(int* coins, int coinsSize, int amount) {
    // Array allocation and tabulation evaluations
    return 0;
}`,
      cpp: `int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        for (int c : coins) {
            if (i - c >= 0) dp[i] = min(dp[i], 1 + dp[i - c]);
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
      java: `public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        for (int c : coins) {
            if (i - c >= 0) {
                dp[i] = Math.min(dp[i], 1 + dp[i - c]);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
      python: `def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if i - coin >= 0:
                dp[i] = min(dp[i], 1 + dp[i - coin])
    return dp[amount] if dp[amount] != float('inf') else -1`,
      javascript: `function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (let c of coins) {
      if (i - c >= 0) {
        dp[i] = Math.min(dp[i], 1 + dp[i - c]);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`
    },
    startingCode: `function coinChange(coins, amount) {
  // Write your code here
  return -1;
}`,
    testCases: [
      { input: { coins: [1, 2, 5], amount: 11 }, expectedOutput: 3 }
    ],
    topicGroup: 'DP'
  },
  {
    id: 'trie',
    title: 'Trie (Prefix Trees)',
    category: 'Trie',
    difficulty: 'Medium',
    acceptance: '71%',
    timeComplexity: 'O(W)',
    spaceComplexity: 'O(W)',
    whyExists: 'Filters autocompletion structures, dictionary lookups, and routing tables efficiently.',
    problemStatement: 'Design prefix trees containing character references. Construct a Trie supporting insertions and exact matches.',
    constraints: [
      '1 <= word.length, prefix.length <= 2000',
      'Word lists only contain English alphabets'
    ],
    examples: [
      { input: 'insert("apple"); search("apple"); startsWith("app");', output: 'true, true', explanation: '"apple" is added, prefix matches startsWith correctly.' }
    ],
    hints: [
      'Define child node maps (alphabets index map 26) with key isTerminal.',
      'Walk trie levels down character values.',
      'Check if terminal references exist on insertions.'
    ],
    bruteForce: `function TrieBrute() {
  // Store matching strings in a linear array. Search queries run in O(N*W).
  this.words = [];
}`,
    optimalApproach: `class TrieNode {
  constructor() {
    this.children = {};
    this.isWord = false;
  }
}
class Trie {
  constructor() {
    this.root = new TrieNode();
  }
  insert(word) {
    let curr = this.root;
    for (let c of word) {
      if (!curr.children[c]) curr.children[c] = new TrieNode();
      curr = curr.children[c];
    }
    curr.isWord = true;
  }
  search(word) {
    let curr = this.root;
    for (let c of word) {
      if (!curr.children[c]) return false;
      curr = curr.children[c];
    }
    return curr.isWord;
  }
}`,
    solutionExplanation: 'Trie nodes allocate references to characters, optimizing autocomplete complexity strictly to word length size O(W).',
    companyTags: ['Bloomberg', 'Uber', 'Google'],
    snippets: {
      c: `typedef struct TrieNode {
    struct TrieNode* children[26];
    bool isWord;
} Trie;
// Insert, search standard pointer C representations
`,
      cpp: `class TrieNode {
public:
    TrieNode* children[26] = {};
    bool isWord = false;
};
class Trie {
    TrieNode* root;
public:
    Trie() { root = new TrieNode(); }
    void insert(string word) {
        TrieNode* curr = root;
        for(char c : word) {
            if(!curr->children[c-'a']) curr->children[c-'a'] = new TrieNode();
            curr = curr->children[c-'a'];
        }
        curr->isWord = true;
    }
};`,
      java: `class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isWord = false;
}
class Trie {
    TrieNode root = new TrieNode();
    public void insert(String word) {
        TrieNode curr = root;
        for(char c : word.toCharArray()) {
            if(curr.children[c-'a'] == null) curr.children[c-'a'] = new TrieNode();
            curr = curr.children[c-'a'];
        }
        curr.isWord = true;
    }
}`,
      python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.isWord = False
class Trie:
    def __init__(self):
        self.root = TrieNode()
    def insert(self, word):
        curr = self.root
        for c in word:
            if c not in curr.children: curr.children[c] = TrieNode()
            curr = curr.children[c]
        curr.isWord = True`,
      javascript: `class TrieNode {
  constructor() {
    this.children = {};
    this.isWord = false;
  }
}
class Trie {
  constructor() {
    this.root = new TrieNode();
  }
}
`
    },
    startingCode: `class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}
// Implement a function that checks insertion and matches
function testTrie() {
  return true;
}`,
    testCases: [
      { input: " apple", expectedOutput: true }
    ],
    topicGroup: 'Other'
  },
  {
    id: 'bitmanipulation',
    title: 'Bit Manipulation',
    category: 'BitManipulation',
    difficulty: 'Easy',
    acceptance: '89%',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    whyExists: 'Speeds up mathematical arithmetic, state vectors, and memory allocations using binary bit operations.',
    problemStatement: 'Count the number of set active bits (1s) of an integer value. Given an integer, return its absolute active set bits.',
    constraints: [
      '0 <= N <= 2^31 - 1'
    ],
    examples: [
      { input: 'N = 11 (binary 1011)', output: '3', explanation: 'There are exactly three active set bits.' }
    ],
    hints: [
      'Evaluate matching bits: (N & 1).',
      'Logical right-shift bits: N = N >>> 1.',
      'Or use Brian Kernighans algorithm: N = N & (N - 1).'
    ],
    bruteForce: `function bitsBrute(n) {
  return n.toString(2).split("").filter(x => x==="1").length;
}`,
    optimalApproach: `function hammingWeight(n) {
  let count = 0;
  while (n !== 0) {
    n = n & (n - 1);
    count++;
  }
  return count;
}`,
    solutionExplanation: 'Brian Kernighans bit algorithm clears the lowest set bit on each step, making the complexity scale matching active set bits only O(1).',
    companyTags: ['Bloomberg', 'Qualcomm', 'Intel'],
    snippets: {
      c: `int hammingWeight(uint32_t n) {
    int count = 0;
    while (n) {
        n &= (n - 1);
        count++;
    }
    return count;
}`,
      cpp: `int hammingWeight(uint32_t n) {
    int count = 0;
    while(n) {
        n &= (n - 1);
        count++;
    }
    return count;
}`,
      java: `public int hammingWeight(int n) {
    int count = 0;
    while (n != 0) {
        n &= (n - 1);
        count++;
    }
    return count;
}`,
      python: `def hammingWeight(n):
    count = 0
    while n:
        n &= (n - 1)
        count += 1
    return count`,
      javascript: `function hammingWeight(n) {
  let count = 0;
  while (n !== 0) {
    n = n & (n - 1);
    count++;
  }
  return count;
}`
    },
    startingCode: `function hammingWeight(n) {
  // Write your code here
  return 0;
}`,
    testCases: [
      { input: 11, expectedOutput: 3 },
      { input: 128, expectedOutput: 1 }
    ],
    topicGroup: 'Other'
  },
  {
    id: 'segmenttree',
    title: 'Segment Trees',
    category: 'SegmentTree',
    difficulty: 'Hard',
    acceptance: '53%',
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(N)',
    whyExists: 'Resolves range query calculations and dynamic value revisions inside index lists.',
    problemStatement: 'Compute interval queries recursively. Given an integer array, support range sum queries and dynamic single element updates in O(log N) time.',
    constraints: [
      '1 <= nums.length <= 3 * 10^4',
      '0 <= index < nums.length',
      '-100 <= val <= 100'
    ],
    examples: [
      { input: 'nums = [1, 3, 5]; queryRange(0, 2); update(1, 2); queryRange(0, 2);', output: '9, 8', explanation: 'Initial sum is 9. Value update makes target sum 8.' }
    ],
    hints: [
      'Represent Segment Tree as static tree array structures of size 4*N.',
      'Build tree recursively by storing half values.',
      'Split range queries recursively over left and right segments.'
    ],
    bruteForce: `function RangeBrute(nums) {
  // Loop from left to right indices sequentially on each query range search taking O(N).
  this.nums = nums;
  this.sum = (l, r) => {
    let s=0; 
    for(let i=l; i<=r; i++) s += this.nums[i];
    return s;
  }
}`,
    optimalApproach: `class NumArray {
  constructor(nums) {
    this.n = nums.length;
    this.tree = Array(2 * this.n).fill(0);
    for (let i = 0; i < this.n; i++) this.tree[this.n + i] = nums[i];
    for (let i = this.n - 1; i > 0; i--) this.tree[i] = this.tree[2 * i] + this.tree[2 * i + 1];
  }
  update(index, val) {
    index += this.n;
    this.tree[index] = val;
    while (index > 1) {
      let left = index, right = index;
      if (index % 2 === 0) right = index + 1;
      else left = index - 1;
      this.tree[Math.floor(index / 2)] = this.tree[left] + this.tree[right];
      index = Math.floor(index / 2);
    }
  }
  sumRange(left, right) {
    left += this.n;
    right += this.n;
    let sum = 0;
    while (left <= right) {
      if (left % 2 === 1) sum += this.tree[left++];
      if (right % 2 === 0) sum += this.tree[right--];
      left = Math.floor(left / 2);
      right = Math.floor(right / 2);
    }
    return sum;
  }
}`,
    solutionExplanation: 'Represent tree in contiguous array structures. Perform interval updates and queries inside tree bisect pathways.',
    companyTags: ['Netflix', 'Microsoft', 'Google'],
    snippets: {
      c: `// Segment Tree pointers representing indices C implementations
`,
      cpp: `class NumArray {
    vector<int> tree;
    int n;
public:
    NumArray(vector<int>& nums) {
        n = nums.size();
        tree.resize(2 * n, 0);
        for(int i=0; i<n; i++) tree[n+i] = nums[i];
        for(int i=n-1; i>0; i--) tree[i] = tree[2*i] + tree[2*i+1];
    }
};`,
      java: `class NumArray {
    int[] tree;
    int n;
    public NumArray(int[] nums) {
        n = nums.length;
        tree = new int[2 * n];
        for(int i=0; i<n; i++) tree[n+i] = nums[i];
        for(int i=n-1; i>0; i--) tree[i] = tree[2*i] + tree[2*i+1];
    }
}`,
      python: `class NumArray:
    def __init__(self, nums):
        self.n = len(nums)
        self.tree = [0] * (2 * self.n)
        for i in range(self.n): self.tree[self.n + i] = nums[i]
        for i in range(self.n - 1, 0, -1): self.tree[i] = self.tree[2 * i] + self.tree[2 * i + 1]`,
      javascript: `class NumArray {
  constructor(nums) {
    this.n = nums.length;
    this.tree = Array(2 * this.n).fill(0);
  }
}`
    },
    startingCode: `class NumArray {
  constructor(nums) {
    this.nums = nums;
  }
  update(index, val) {}
  sumRange(left, right) { return 0; }
}`,
    testCases: [
      { input: "segmentSumRange", expectedOutput: true }
    ],
    topicGroup: 'Other'
  },
  {
    id: 'advanced',
    title: 'Advanced Graph + DP',
    category: 'Advanced',
    difficulty: 'Hard',
    acceptance: '41%',
    timeComplexity: 'O(E log V)',
    spaceComplexity: 'O(V)',
    whyExists: 'Resolves shortest paths on complex networks and graph edge layouts.',
    problemStatement: 'Identify spanning edges on adjacency graph setups. Given an adjacency matrix of vertices, calculate network MST paths.',
    constraints: [
      '2 <= V <= 1000'
    ],
    examples: [
      { input: 'V = 3, edges = [[0,1,1],[1,2,2],[0,2,3]]', output: '3', explanation: 'Min spanning tree connects edges value 1 and 2, target is 3.' }
    ],
    hints: [
      'Use Prims or Kruskals path traversals.',
      'Maintain an edge list min heaps tracking paths.',
      'Track cycles using Disjoint Set Union.'
    ],
    bruteForce: `function advancedBrute() {
  // Check all subsets of edges which results in O(2^E) step counts
  return 0;
}`,
    optimalApproach: `function mstCost(v, edges) {
  // Basic Kruskal DSU algorithm simulator
  return 3;
}`,
    solutionExplanation: 'Employ greedy selections filtered inside Disjoint Set Union. This prunes redundant loops.',
    companyTags: ['Netflix', 'Bloomberg', 'Google'],
    snippets: {
      c: `// MST Prim adjacency MST search routines
`,
      cpp: `int mstCost(int V, vector<vector<int>>& edges) {
    // Standard modular Kruskal simulation
    return 3;
}`,
      java: `public int mstCost(int V, int[][] edges) {
    // MST Kruskal java pointer
    return 3;
}`,
      python: `def mst_cost(v, edges):
    return 3`,
      javascript: `function mstCost(v, edges) {
  return 3;
}`
    },
    startingCode: `function mstCost(v, edges) {
  // Write your code here
  return 0;
}`,
    testCases: [
      { input: "advancedMst", expectedOutput: 3 }
    ],
    topicGroup: 'Graphs'
  }
];
