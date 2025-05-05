import { spawn } from 'child_process';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const TEMP_DIR = path.join(process.cwd(), 'temp');
const EXECUTION_TIMEOUT = 30000; // 30 seconds

const languageConfigs = {
  python: {
    extension: '.py',
    command: 'python',
    args: (filename) => ['-u', filename]
  },
  javascript: {
    extension: '.js',
    command: 'node',
    args: (filename) => [filename]
  },
  // Add more languages as needed
};

// Ensure temp directory exists
const ensureTempDir = async () => {
  if (!existsSync(TEMP_DIR)) {
    await mkdir(TEMP_DIR, { recursive: true });
  }
};

export const runCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: 'Code and language are required'
      });
    }

    const config = languageConfigs[language.toLowerCase()];
    if (!config) {
      return res.status(400).json({
        success: false,
        error: 'Unsupported programming language'
      });
    }

    const filename = `${uuidv4()}${config.extension}`;
    const filepath = path.join(TEMP_DIR, filename);

    // Ensure temp directory exists
    await ensureTempDir();
    
    // Write code to temporary file
    await writeFile(filepath, code);

    // Execute the code
    const process = spawn(config.command, config.args(filepath));
    
    let output = '';
    let error = '';

    // Collect stdout
    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    // Collect stderr
    process.stderr.on('data', (data) => {
      error += data.toString();
    });

    // Handle process completion
    const result = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        process.kill();
        resolve({ error: 'Execution timed out after ' + (EXECUTION_TIMEOUT / 1000) + ' seconds' });
      }, EXECUTION_TIMEOUT);

      process.on('error', (err) => {
        clearTimeout(timeout);
        reject(new Error(`Failed to start process: ${err.message}`));
      });

      process.on('close', (code) => {
        clearTimeout(timeout);
        if (code !== 0) {
          resolve({ error: error || 'Execution failed' });
        } else {
          resolve({ output });
        }
      });
    });

    // Clean up temporary file
    try {
      await unlink(filepath);
    } catch (err) {
      console.error('Failed to delete temporary file:', err);
      // Continue execution even if cleanup fails
    }

    // Send response
    if (result.error) {
      return res.status(400).json({
        success: false,
        error: result.error.trim()
      });
    }

    return res.status(200).json({
      success: true,
      output: result.output.trim()
    });

  } catch (err) {
    console.error('Code execution error:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while executing code'
    });
  }
};