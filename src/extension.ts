import { PythonExtension } from '@vscode/python-extension';

import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';


export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('extension.runCommand', async (uri: vscode.Uri) => {

		// Load the Python extension API
		const pythonApi: PythonExtension = await PythonExtension.api();

		const environmentPath = pythonApi.environments.getActiveEnvironmentPath();

		// path of the file
		const oldFilePath = uri.fsPath;

		const folderPath = oldFilePath.split('/').slice(0, -1).join('/');
		const fileName = oldFilePath.split('/').pop();

		const fileNameWithoutExtension = fileName?.split('.')[0];

		const newFilePath = `${folderPath}${path.sep}${fileNameWithoutExtension}_ui.py`;

		const pythonPath = environmentPath.path;

		const pyside6UicPath = path.join(path.dirname(pythonPath), 'pyside6-uic');

		const command = `${pyside6UicPath} ${oldFilePath} -o ${newFilePath}`;

		exec(command, (error, stdout, stderr) => {
		  if (error) {
			vscode.window.showErrorMessage(`Error: ${stderr}`);
			return;
		  }
		  vscode.window.showInformationMessage(`${fileName} converted to successfuly!`);
		});
	  });

	context.subscriptions.push(disposable);
}

export function deactivate() {}
