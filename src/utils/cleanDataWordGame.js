const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/dataWordGame.txt');

const data = fs.readFileSync(filePath, 'utf8');

const cleaned = data
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => {
        const words = line.split(/\s+/); 
        return words.length === 2;
    });

fs.writeFileSync(filePath, cleaned.join('\n'), 'utf8');

console.log(`✅ Đã lọc xong. Còn lại ${cleaned.length} dòng có đúng 2 từ.`);
