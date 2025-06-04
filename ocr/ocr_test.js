const { spawn } = require('child_process');

// Path to ocr python script
const ocr_python_script_path = './ocr_menu.py';

// Dynamic vaue from Node.js
const menu_url = 'https://www.charmedthai.com.au/gordon/menuimage/original/menu_670ef4d4b50d5.jpg';

// Spawn child 
const python_ocr_process = spawn('python3', [ocr_python_script_path, menu_url]);

// Listen for data from python script
python_ocr_process.stdout.on('data', (data) =>{
    console.error(`Mesage from python: ${data}`)
})

// Listen for errors
python_ocr_process.stderr.on('data', (data) => {
    console.error(`Python error: ${data}`);
});

// Listen for the process to exit
python_ocr_process.on('close', (code) =>{
    console.log(`OCR process exited with code ${code}`)
})