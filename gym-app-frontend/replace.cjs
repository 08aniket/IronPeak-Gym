const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      content = content.replace(/#ff6b00/g, '#ff2020');
      content = content.replace(/#e05e00/g, '#d11212');
      content = content.replace(/rgba\(255, 107, 0/g, 'rgba(255, 32, 32');
      content = content.replace(/rgba\(255,107,0/g, 'rgba(255,32,32');
      content = content.replace(/Rajdhani/g, 'Oswald');
      content = content.replace(/Barlow/g, 'Outfit');
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log("Updated", fullPath);
      }
    }
  }
}

replaceInDir('d:/fullstack-gym-iot-app-master/fullstack-gym-iot-app-master/gym-app-frontend/src');
