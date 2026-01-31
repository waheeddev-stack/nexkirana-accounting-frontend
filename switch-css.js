import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mainJsPath = path.join(__dirname, 'src', 'main.jsx');
const indexCssPath = path.join(__dirname, 'src', 'index.css');
const stylesCssPath = path.join(__dirname, 'src', 'styles.css');

// Read current main.jsx
let mainContent = fs.readFileSync(mainJsPath, 'utf8');

const args = process.argv.slice(2);
const mode = args[0];

if (mode === 'tailwind') {
  // Switch to Tailwind CSS with directives
  mainContent = mainContent.replace("import './styles.css'", "import './index.css'");
  fs.writeFileSync(mainJsPath, mainContent);
  console.log('✅ Switched to Tailwind CSS with @tailwind directives');
  console.log('Note: You may see "Unknown at rule" warnings in your editor, but the app will work fine.');
} else if (mode === 'plain') {
  // Switch to plain CSS without directives
  mainContent = mainContent.replace("import './index.css'", "import './styles.css'");
  fs.writeFileSync(mainJsPath, mainContent);
  console.log('✅ Switched to plain CSS without Tailwind directives');
  console.log('Note: This avoids editor warnings but may have limited styling.');
} else {
  console.log('Usage:');
  console.log('  node switch-css.js tailwind  # Use Tailwind with @tailwind directives');
  console.log('  node switch-css.js plain     # Use plain CSS without directives');
}