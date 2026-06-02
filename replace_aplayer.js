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
            let content = fs.readFileSync(fullPath, 'utf8');
            const regex = /\{%\s*mmedia\s+"aplayer"\s+"name:(.*?)"\s+"artist:(.*?)"\s+"url:(.*?)"\s*%\}/g;
            if (regex.test(content)) {
                const newContent = content.replace(regex, '{% aplayer "$1" "$2" "$3" %}');
                fs.writeFileSync(fullPath, newContent);
                console.log('Replaced mmedia tags in:', file);
            }
        }
    }
}

processDir(dir);
