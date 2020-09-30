// Imports
const fs = require('fs');
const http = require('http');
const url = require('url');

const replaceTemplate = require('./starter/modules/replaceTemplate');

//////////////////// ?
////// ? FILES

//! Blocking, synchrounous way
// const textIn = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}. \n Created on ${Date.now()}`;
// fs.writeFileSync('./starter/txt/output.txt', textOut);
// console.log('File has been written!');

//! Non-blocking, asynchrounous way
// fs.readFile('./starter/txt/start.txt', 'utf-8', (err, data1) => {
// 	if (err) {
// 		return console.log('ERROR! :-(');
// 	}

// 	fs.readFile(`./starter/txt/${data1}.txt`, 'utf-8', (err, data2) => {
// 		console.log(data2);
// 		fs.readFile('./starter/txt/append.txt', 'utf-8', (err, data3) => {
// 			console.log(data3);

// 			fs.writeFile('./starter/txt/final.txt', `${data2} \n ${data3}`, 'utf-8', (err) => {
// 				console.log('File has been written');
// 			});
// 		});
// 	});
// });
// console.log('Will read file');

//////////////////// ?
////// ? SERVER
// Get the templates(html-files)
const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html`, 'utf-8');

// Get the data from the data.json file
const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8');
// Convert(parse) the JSON data string to a object
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
	// console.log(req.url);
	// console.log(url.parse(req.url, true));
	const { query, pathname } = url.parse(req.url, true);

	// Overview page
	if (pathname === '/' || pathname === '/overview') {
		res.writeHead(200, { 'Content-type': 'text/html' });

		/**
		 * I loop over this dataObj array here which holds all of the products(desc, id etc.)
		 * and with each iteration we replace the placeholders in the tempCard with the current product(el).
		 */
		const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
		const output = tempOverview.replace('{%PRODUCT-CARDS%}', cardsHtml);

		// console.log(cardsHtml);

		res.end(output);

		// Product page
	} else if (pathname === '/product') {
		// If we want to have HTML displayed:
		res.writeHead(200, { 'Content-type': 'text/html' });

		// Gets the product data from the dataObj depending on what we click on
		const product = dataObj[query.id];
		// Replaces the output with given product-data
		const output = replaceTemplate(tempProduct, product);

		// console.log(output);
		// console.log(product);
		res.end(output);

		// Api page
	} else if (pathname === '/api') {
		return fs.readFile('./starter/dev-data/data.json', 'utf-8', (err, data) => {
			const productData = JSON.parse(data);
			res.writeHead(200, { 'Content-type': 'application/json' });
			res.end(data);
		});

		// Not found page
	} else {
		res.writeHead(404, {
			'Content-type': 'text/html',
			'my-own-header': 'hello-word'
		});
		res.end('<h2>Page not Found!</h1>');
	}

	res.end('Hello World from the server!');
});

server.listen(8000, '127.0.0.1', () => {
	console.log('Listening to requests on port 8000');
});
