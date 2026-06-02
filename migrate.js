const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'source', '_posts');

function processDir(d) {
    const files = fs.readdirSync(d);
    for (const file of files) {
        const fullPath = path.join(d, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.md')) {
            if (file === '补档声明.md' || file === 'README.md') continue;
            
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.startsWith('---')) {
                // Check if already migrated
                if (content.includes('is_old: true')) continue;
                
                // We'll insert the new keys right after the first ---
                const insertText = 'is_old: true\ncategories: 补档\n';
                const newContent = '---\n' + insertText + content.substring(4);
                
                fs.writeFileSync(fullPath, newContent);
                console.log('Migrated:', file);
            }
        }
    }
}

processDir(dir);
