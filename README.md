# BigO-me - Code Complexity Analyzer

![BigO-me Icon](images/icon.png)

A powerful VS Code extension that analyzes the time and space complexity of your code across multiple programming languages to help you write more efficient algorithms. 

**🎯 Published on VS Code Marketplace as "BigO-me - Code Complexity Analyzer"**

## Features

🔍 **Multi-Language Smart Analysis**: Automatically detects and analyzes complexity for:
- **JavaScript/TypeScript**: AST-based analysis with Acorn parser
- **Python**: Pattern-based analysis with Python-specific syntax recognition  
- **Java**: Object-oriented complexity analysis with collection operations
- **C/C++**: Low-level complexity analysis with memory operations
- **Graph Algorithms**: O(V + E) detection for BFS, DFS, and DAG algorithms across all languages

📊 **Visual Indicators**: 
- Inline complexity annotations showing O(n) notation
- Color-coded complexity ratings (Green: O(1), Yellow: O(n), Orange: O(n²), Red: O(2^n))
- Hover tooltips with detailed explanations and algorithm identification

📈 **Comprehensive Detection**: 
- Loops (for, while, forEach, map, filter, list comprehensions)
- Recursive functions with exponential complexity detection
- Graph traversal algorithms (BFS, DFS, topological sort)
- Data structure operations across different languages
- Nested algorithms with accurate nesting level tracking

🎯 **Language-Specific Intelligence**:
- **Python**: List comprehensions, generator expressions, collections.deque
- **Java**: Stream operations, enhanced for loops, collection frameworks
- **C/C++**: Pointer operations, memory allocation, struct handling
- **JavaScript/TypeScript**: Arrow functions, array methods, async patterns

⚙️ **Smart Configuration**:
- Automatic analysis on file save (optional)
- Customizable inline annotations
- Language-specific pattern recognition
- Graph algorithm heuristic detection

## Supported Languages & Complexity Patterns

### JavaScript/TypeScript
- ✅ AST-based parsing for accurate analysis
- ✅ Array methods (map, filter, reduce, forEach)
- ✅ Async/await patterns and Promise chains
- ✅ Graph algorithms with Set/Map collections

### Python  
- ✅ List comprehensions and generator expressions
- ✅ Collections module (deque, defaultdict)
- ✅ Recursive patterns and dynamic programming
- ✅ Graph algorithms with built-in data structures

### Java
- ✅ Collection framework operations (ArrayList, HashMap, etc.)
- ✅ Stream API and lambda expressions
- ✅ Enhanced for loops and traditional iterations
- ✅ Graph algorithms with Java collections

### C/C++
- ✅ Pointer arithmetic and memory allocation
- ✅ Array operations and struct handling
- ✅ Function recursion and stack operations
- ✅ Graph algorithms with manual memory management

## Algorithm Detection Examples

### Graph Algorithms (O(V + E))
The extension intelligently detects graph algorithms across all supported languages:

**Python BFS:**
```python
def bfs(graph, start):
    visited = set()
    queue = deque([start])  # ← Detected as O(V + E)
    while queue:
        node = queue.popleft()
        # ... traversal logic
```

**Java BFS:**
```java
public void bfs(Map<Integer, List<Integer>> graph, int start) {
    Queue<Integer> queue = new LinkedList<>();  // ← Detected as O(V + E)
    Set<Integer> visited = new HashSet<>();
    // ... traversal logic
}
```

**C BFS:**
```c
void bfs(int graph[][100], int vertices, int start) {
    int visited[100] = {0};
    struct Queue q = {0};  // ← Detected as O(V + E)
    // ... traversal logic
}
```

### Recursive Patterns (O(2^n))
```python
def fibonacci(n):  # ← Detected as O(2^n)
    if n <= 1: return n
    return fibonacci(n-1) + fibonacci(n-2)
```

## Getting Started

After installation, the extension automatically activates when you open files in supported languages (JavaScript, TypeScript, Python, Java, C, C++).

### Quick Start Guide
1. **Open a code file** in one of the supported languages
2. **Automatic Analysis**: The extension will analyze your code and show inline complexity annotations
3. **Manual Analysis**: Select code and right-click → "Analyze Time & Space Complexity"
4. **View Report**: Use Command Palette → "Show Complexity Report" for detailed analysis

### First Time Setup
- Open VS Code Settings (Ctrl+, or Cmd+,)
- Search for "complexity analyzer"
- Configure your preferences:
  - Enable/disable automatic analysis on file save
  - Show/hide inline annotations
  - Customize complexity color coding

## Usage

### Quick Analysis
1. Select code or place cursor in a function
2. Right-click and choose "Analyze Time & Space Complexity"
3. View inline annotations and complexity ratings

### Command Palette
- `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
- Type "Analyze Time & Space Complexity"

### Detailed Report
- Use command "Show Complexity Report" to open interactive webview
- Export reports as HTML for documentation

## Configuration

Open VS Code settings and search for "complexity":

```json
{
  "complexityAnalyzer.enableAutoAnalysis": false,
  "complexityAnalyzer.showInlineAnnotations": true
}
```

## How It Works

The extension uses advanced static analysis to:

1. **Parse your code** using language-specific parsers (Acorn for JS/TS)
2. **Detect patterns** like loops, recursion, and data structure operations  
3. **Calculate complexity** using established algorithms and heuristics
4. **Present results** with visual indicators and detailed explanations

## Complexity Guide

| Notation | Complexity | Color | Description |
|----------|------------|-------|-------------|
| O(1) | Constant | 🟢 Green | Best - Operations don't scale with input |
| O(log n) | Logarithmic | 🟢 Green | Excellent - Binary search, balanced trees |
| O(n) | Linear | 🟡 Yellow | Good - Single loops, simple iterations |
| O(n log n) | Log-linear | 🟡 Yellow | Fair - Efficient sorting algorithms |
| O(n²) | Quadratic | 🟠 Orange | Poor - Nested loops, bubble sort |
| O(2^n) | Exponential | 🔴 Red | Bad - Avoid in production code |

## Examples

### Before Analysis
```javascript
function findDuplicates(arr) {
    const duplicates = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) {
                duplicates.push(arr[i]);
            }
        }
    }
    return duplicates;
}
```

### After Analysis
```javascript
function findDuplicates(arr) {                    // T: O(n²), S: O(n)
    const duplicates = [];
    for (let i = 0; i < arr.length; i++) {      // 🟠 O(n) - Outer loop
        for (let j = i + 1; j < arr.length; j++) { // 🔴 O(n²) - Nested loop
            if (arr[i] === arr[j]) {
                duplicates.push(arr[i]);
            }
        }
    }
    return duplicates;
}
```

## Installation

### From VS Code Marketplace (Recommended)
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X or Cmd+Shift+X on Mac)
3. Search for "**BigO-me - Code Complexity Analyzer**"
4. Click Install

### From Command Line
```bash
code --install-extension BigO-me.code-complexity-analyzer
```

### Manual Installation
1. Download the `.vsix` file from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=BigO-me.code-complexity-analyzer)
2. Open VS Code
3. Go to Extensions view
4. Click the "..." menu and select "Install from VSIX..."
5. Select the downloaded `.vsix` file

## Development

To contribute or modify:

```bash
# Clone the repository
git clone <repository-url>
cd code-complexity-analyzer

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Run in development mode
npm run watch

# Test the extension
F5 (opens new VS Code window with extension loaded)
```

## Release Notes

### 0.0.2 (Current)
- ✨ **Enhanced Multi-Language Support**: Added comprehensive support for Python, Java, and C/C++
- 🔧 **Variable-Aware Analysis**: Improved nested loop detection (O(n × m) vs O(n²))
- 🎨 **Better UI/UX**: Enhanced hover messages and color-coded complexity indicators
- 🔍 **Graph Algorithm Detection**: Intelligent detection of BFS, DFS, and DAG algorithms
- 📊 **Improved Accuracy**: AST-based analysis for JavaScript/TypeScript
- 🐛 **Bug Fixes**: Fixed complexity calculation for nested structures
- 🎯 **Marketplace Ready**: Published as "BigO-me - Code Complexity Analyzer"

### 0.0.1
- 🚀 **Initial Release**: Basic complexity analysis for JavaScript/TypeScript
- 📝 **Inline Annotations**: Show complexity directly in code
- 🖥️ **Webview Reports**: Detailed complexity analysis reports
- ⚙️ **Configuration Options**: Customizable analysis settings

## Troubleshooting

### Common Issues

**Q: The extension isn't showing complexity annotations**
- Ensure you're working with a supported file type (.js, .ts, .py, .java, .c, .cpp)
- Check that inline annotations are enabled in settings
- Try manually triggering analysis via Command Palette

**Q: Analysis seems incorrect**
- The extension uses heuristic-based analysis which may not be 100% accurate for all edge cases
- Complex recursive algorithms may require manual verification
- Consider the algorithm's actual behavior vs. static analysis limitations

**Q: Performance issues with large files**
- The extension analyzes files on save by default
- Disable auto-analysis for very large files
- Use manual analysis on selected code sections

### Debug Mode
Enable debug logging by:
1. Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
2. Type "Developer: Reload Window"
3. Check VS Code Developer Console for detailed logs

## Contributing

We welcome contributions! Here's how to get started:

### Development Setup
```bash
# Clone the repository
git clone https://github.com/BigO-me/code-complexity-analyzer.git
cd code-complexity-analyzer

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes
npm run watch

# Test the extension
F5 (opens new VS Code window with extension loaded)
```

### Adding Language Support
1. Add language patterns to `src/complexityAnalyzer.ts`
2. Update activation events in `package.json`
3. Add test cases for the new language
4. Update documentation

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support & Feedback

We'd love to hear from you! 

- **🐛 Report Issues**: [GitHub Issues](https://github.com/BigO-me/code-complexity-analyzer/issues)
- **💡 Feature Requests**: [GitHub Discussions](https://github.com/BigO-me/code-complexity-analyzer/discussions)
- **⭐ Rate & Review**: [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=BigO-me.code-complexity-analyzer)
- **📧 Contact**: support@bigo-me.dev

### Show Your Support
If you find this extension helpful:
- ⭐ **Star** the repository
- 📝 **Write a review** on the VS Code Marketplace  
- 🐦 **Share** with your developer community
- 💖 **Sponsor** the project development

---

<div align="center">

**🚀 Happy Coding with BigO-me! 🚀**

*Optimize your algorithms, one complexity analysis at a time.*

[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-blue?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=BigO-me.code-complexity-analyzer)
[![Version](https://img.shields.io/badge/version-0.0.2-green?style=for-the-badge)](https://marketplace.visualstudio.com/items?itemName=BigO-me.code-complexity-analyzer)
[![License](https://img.shields.io/badge/license-ISC-blue?style=for-the-badge)](LICENSE)

*Built with ❤️ for developers who care about performance*

</div>
