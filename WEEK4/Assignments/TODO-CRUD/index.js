 /*Question. Create a todo on your own HTTP server:
1.) Where you can perform the CRUD Operations
2.) Store the data of todos in json file example - todo.json
 */
const http = require('http'); // Importing http module
const fs = require('fs').promises; // Importing fs module . Promises is used to handle async operations. It is necessary to write .promises with fs module because fs module does not have promises by default.
const FILE = 'todo.json';// File name where data will be stored. FILE is a constant variable which stores the file name.


const initializeFile = async () => {
  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, '[]');
  }
};
// const initializeFile is a function which is used to check whether the file exists or not. If the file does not exist then it will create a new file with the name todo.json and write an empty array in it.
//try block is used to check whether the file exists or not. If the file does not exist then it will throw an error and catch block will be executed.
// await fs.access(FILE) is used to check whether the file exists or not. If the file does not exist then it will throw an error and catch block will be executed.
// await fs.writeFile(FILE, '[]') is used to create a new file with the name todo.json and write an empty array in it.
// array means [] is used to store the data of todos in the file.

const server = http.createServer(async (req, res) => {
  const method = req.method;
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/todos') {
    try {
      if (method === 'GET') {
        const todos = JSON.parse(await fs.readFile(FILE, 'utf-8'));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(todos));
      } else if (method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
          const newTodo = JSON.parse(body);
          const todos = JSON.parse(await fs.readFile(FILE, 'utf-8'));
          todos.push(newTodo);
          await fs.writeFile(FILE, JSON.stringify(todos));
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newTodo));
        });
      } else if (method === 'PUT') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
          const updatedTodo = JSON.parse(body);
          const todos = JSON.parse(await fs.readFile(FILE, 'utf-8'));
          const index = todos.findIndex(t => t.id === updatedTodo.id);
          if (index !== -1) {
            todos[index] = updatedTodo;
            await fs.writeFile(FILE, JSON.stringify(todos));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(updatedTodo));
          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Todo not found' }));
          }
        });
      } else if (method === 'DELETE') {
        const id = url.searchParams.get('id');
        const todos = JSON.parse(await fs.readFile(FILE, 'utf-8'));
        const updatedTodos = todos.filter(t => t.id !== id);
        await fs.writeFile(FILE, JSON.stringify(updatedTodos));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Todo deleted' }));
      } else {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

initializeFile().then(() => {
  server.listen(3000, () => console.log('Server running on port 3000'));
});
