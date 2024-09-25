// todo.mjs (arquivo com extensão .mjs)

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import Table from 'cli-table';

import pkg from './package.json' assert { type: 'json' };

const { Todo } = await import('./classes.js');
const { createList, getLists } = await import('./database/controllers.js');

const program = new Command();

program.version(pkg.version);

program
	.command('add-list [listName]')
	.description('Creates a new todo list.')
	.action(async (listName) => {
		let answers;
		if (!listName) {
			answers = await inquirer.prompt([
				{
					type: 'input',
					name: 'listName',
					message: 'Please enter the name of your new list:',
					validate: (value) => (value ? true : 'Creation of nameless list forbidden.'),
				},
			]);
		}
		createList(listName || answers.listName);
		console.log(`${chalk.green.italic(`New list - ${listName || answers.listName} - sucessfully created!`)}`);
	});

program
	.command('lists')
	.description('List every todo list in the database.')
	.action(() => {
		const data = getLists();
		createTable(data);
	});

program.parse(process.argv);


function createTable(data) {

    if (data.length === 0) {
		console.log(`${chalk.blue("No data to show.")}`);
        return;
    }

    const headerArray = Object.keys(data[0]);
    const colWidths = headerArray.map((_, index) => index === 0 ? 10 : 20);
	
	const table = new Table({
			head: headerArray,
			colWidths: colWidths
	});

    data.forEach(item => {
        const row = headerArray.map(header => item[header] ? item[header] : "-");
        table.push(row);
    })

	console.log(table.toString());
}