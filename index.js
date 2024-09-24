// todo.mjs (arquivo com extensão .mjs)

import { Command } from 'commander';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import inquirer from 'inquirer';
import chalk from 'chalk';
import Table from 'cli-table';

import pkg from './package.json' assert { type: 'json' };

const { Todo } = await import('./classes.js');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); 

const dbPath = join(__dirname, 'todos.json');

const program = new Command();

program.version(pkg.version);

program
  .command('add [todo]')
  .description('Adiciona uma tarefa.')
  .option('-s, --status [status]', 'Status inicial da tarefa.')
  .action(async (todo, options) => {
    let answers;
    if (!todo) {
      answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'todo',
          message: 'Qual o seu to-do?',
          validate: (value) => (value ? true : 'Não é permitido criar uma tarefa sem título.'),
        },
      ]);
    }
    const data = getTodoList(dbPath);
    data.push(new Todo(todo || answers.todo, options.status === 'true'));
    saveTodoList(dbPath, data);
    console.log(`${chalk.green.italic('Tarefa adicionada com sucesso!')}`);
  });

program
  .command('list')
  .description('Mostra lista de tarefas.')
  .action(() => {
    const data = getTodoList(dbPath);
    listTodoList(data);
  })

program.parse(process.argv);

function getTodoList(path) {
  const data = fs.existsSync(path) ? fs.readFileSync(path) : [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

function saveTodoList(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, '\t'));
}

function listTodoList(data) {
    const table = new Table({
        head: ['id', 'tarefa', 'status'],
        colWidths: [10, 20, 15]
    });
    data.map((todo, index) =>
        table.push(
            [index, todo.title, todo.done ? chalk.green('Feito') : 'Pendente']
        )
    );
    console.log(table.toString());
}