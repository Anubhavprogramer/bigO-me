# 🚀 How to Test Your Code Complexity Analyzer Extension

## Quick Testing Guide (F5 Alternative)

### Step 1: Prepare the Extension
```bash
cd /Users/batch-2/Desktop/vsCodeExtension
npm run compile
```

### Step 2: Launch Extension Development Host
**Option A: Command Palette**
1. Open VS Code
2. Open this project folder
3. Press `Cmd+Shift+P`
4. Type: `Tasks: Run Task`
5. Select: `watch`
6. Press `Cmd+Shift+P` again
7. Type: `Developer: Reload Window`
8. Press `Cmd+Shift+P` once more
9. Type: `Debug: Start Debugging` or `Developer: Start Extension Host`

**Option B: Terminal**
```bash
code --extensionDevelopmentPath=/Users/batch-2/Desktop/vsCodeExtension
```

**Option C: Settings Menu**
1. VS Code → View → Command Palette
2. Type: Extensions: Install from VSIX
3. Browse to your .vsix file (when we create one)

### Step 3: Test the Extension
Once the new VS Code window opens:

1. **Create a test file**: `test.js`
2. **Add some code**:
```javascript
function bubbleSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}
```

3. **Select the function** (highlight it)
4. **Right-click** → "Analyze Time & Space Complexity"
5. **Or press `Cmd+Shift+P`** → "Analyze Time & Space Complexity"

### Expected Results:
- **Inline annotation**: `T: O(n²), S: O(1)`
- **Popup message**: "Time Complexity: O(n²), Space Complexity: O(1)"
- **Hover tooltip**: Detailed breakdown with line-by-line analysis

### To View Detailed Report:
1. Press `Cmd+Shift+P`
2. Type: "Show Complexity Report"
3. Interactive webview opens with charts and analysis

## Alternative: Package and Install Extension

### Create Extension Package:
```bash
npx vsce package --allow-missing-repository --allow-missing-license
```

### Install Package:
```bash
code --install-extension code-complexity-analyzer-0.0.1.vsix
```

## Troubleshooting

### If commands don't appear:
1. Check Developer Console: `Help → Toggle Developer Tools`
2. Look for extension activation messages
3. Reload window: `Cmd+Shift+P` → "Developer: Reload Window"

### If analysis doesn't work:
1. Check file is saved
2. Ensure language is JavaScript/TypeScript
3. Check VS Code console for errors

## Your Extension is Working If:
- ✅ Commands appear in Command Palette
- ✅ Right-click context menu shows "Analyze Time & Space Complexity"
- ✅ Inline annotations appear after analysis
- ✅ Webview opens with detailed reports
- ✅ Hover tooltips show complexity details

## Demo Code to Test:

```javascript
// O(1) - Constant
function constant(x) { return x * 2; }

// O(n) - Linear
function linear(arr) {
    return arr.reduce((sum, x) => sum + x, 0);
}

// O(n²) - Quadratic
function quadratic(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            console.log(matrix[i][j]);
        }
    }
}

// O(2^n) - Exponential
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
```

Happy testing! 🎉
