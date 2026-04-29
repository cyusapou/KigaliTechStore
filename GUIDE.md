FakeStoreAPI (v2.1.11)
Download OpenAPI specification:Download

E-mail: support@fakestoreapi.com
URL: https://fakestoreapi.com/docs
A free fake API for testing and prototyping e-commerce applications.

🛒 Products
Get all products
Retrieve a list of all available products.

Responses
200 Success
400 Bad request

get
/products
Request samples
JavaScript (Browser)Node.js (Axios)PHPcURLPython

Copy
const axios = require('axios');
axios.get('https://fakestoreapi.com/products')
  .then(response => console.log(response.data));
Response samples
200
Content type
application/json

Copy
Expand allCollapse all
[
{
"id": 0,
"title": "string",
"price": 0.1,
"description": "string",
"category": "string",
"image": "http://example.com"
}
]
Add a new product
Create a new product.

Request Body schema: application/json
required
id	
integer
title	
string
price	
number <float>
description	
string
category	
string
image	
string <uri>
Responses
201 Product created successfully
400 Bad request

post
/products
Request samples
PayloadJavaScript (Browser)Node.js (Axios)PHPcURLPython

Copy
const axios = require('axios');
const product = { title: 'New Product', price: 29.99 };
axios.post('https://fakestoreapi.com/products', product)
  .then(response => console.log(response.data));
Response samples
201
Content type
application/json

Copy
{
"id": 0,
"title": "string",
"price": 0.1,
"description": "string",
"category": "string",
"image": "http://example.com"
}
Get a single product
Retrieve details of a specific product by ID.

path Parameters
id
required
integer
Responses
200 Success
400 Bad request

get
/products/{id}
Request samples
JavaScript (Browser)Node.js (Axios)PHPcURLPython

Copy
const axios = require('axios');
axios.get('https://fakestoreapi.com/products/1')
  .then(response => console.log(response.data));
Response samples
200
Content type
application/json

Copy
{
"id": 0,
"title": "string",
"price": 0.1,
"description": "string",
"category": "string",
"image": "http://example.com"
}
Update a product
Update an existing product by ID.

path Parameters
id
required
integer
Request Body schema: application/json
required
id	
integer
title	
string
price	
number <float>
description	
string
category	
string
image	
string <uri>
Responses
200 Product updated successfully
400 Bad request

put
/products/{id}
Request samples
PayloadJavaScript (Browser)Node.js (Axios)PHPcURLPython

Copy
const axios = require('axios');
const product = { title: 'Updated Product', price: 39.99 };
axios.put('https://fakestoreapi.com/products/1', product)
  .then(response => console.log(response.data));
Response samples
200
Content type
application/json

Copy
{
"id": 0,
"title": "string",
"price": 0.1,
"description": "string",
"category": "string",
"image": "http://example.com"
}
Delete a product
Delete a specific product by ID.

path Parameters
id
required
integer
Responses
200 Product deleted successfully
400 Bad request

delete
/products/{id}
Request samples
JavaScript (Browser)Node.js (Axios)PHPcURLPython

Copy
const axios = require('axios');
axios.delete('https://fakestoreapi.com/products/1')
  .then(response => console.log(response.data));
🛍️ Carts
Get all carts
Retrieve a list of all available carts.

Responses
200 Success
400 Bad request

get
/carts
Request samples
JavaScript (Browser)Node.js (Axios)PHPcURLPython

Copy
const axios = require('axios');
axios.get('https://fakestoreapi.com/carts')
  .then(response => console.log(response.data));
Response samples
200
Content type
application/json

Copy
Expand allCollapse all
[
{
"id": 0,
"userId": 0,
"products": []
}
]
Add a new cart
Create a new cart.

Request Body schema: application/json
required
id	
integer
userId	
integer
products	
Array of objects (Product)
Responses
201 Cart created successfully
400 Bad request

post
/carts
Request samples
PayloadJavaScript (Browser)Node.js (Axios)PHPcURLPython

Copy
const axios = require('axios');
const cart = { userId: 1, products: [{ id: 1 }] };
axios.post('https://fakestoreapi.com/carts', cart)
  .then(response => console.log(response.data));
Response samples
201
Content type
application/json

Copy
Expand allCollapse all
{
"id": 0,
"userId": 0,
"products": [
{}
]
}
Get a single cart
Retrieve details of a specific cart by ID.

path Parameters
id
required
integer
Responses
200 Success
400 Bad request

get
/carts/{id}
Request samples
JavaScript (Browser)Node.js (Axios)PHPcURLPython

Copy
const axios = require('axios');
axios.get('https://fakestoreapi.com/carts/1')
  .then(response => console.log(response.data));
Response samples
200
Content type
application/json

Copy
Expand allCollapse all
{
"id": 0,
"userId": 0,
"products": [
{}
]
}
Update a cart
Update an existing cart by ID.

path Parameters
id
required
integer
Request Body schema: application/json
required
id	
integer
userId	
integer
products	
Array of objects (Product)
Responses
200 Cart updated successfully
400 Bad request

put
/carts/{id}
Request samples
PayloadJavaScript (Browser)Node.js (Axios)PHPcURLPython

Copy
const axios = require('axios');
const cart = { userId: 1, products: [{ id: 2 }] };
axios.put('https://fakestoreapi.com/carts/1', cart)
  .then(response => console.log(response.data));
Response samples
200
Content type
application/json

Copy
Expand allCollapse all
{
"id": 0,
"userId": 0,
"products": [
{}
]
}
Delete a cart
Delete a specific cart by ID.

path Parameters
id
required
integer
Responses
200 Cart deleted successfully
400 Bad request

delete
/carts/{id}
Request samples
JavaScript (Browser)Node.js (Axios)PHPcURLPython

Copy
const axios = require('axios');
axios.delete('https://fakestoreapi.com/carts/1')
  .then(response => console.log(response.data));
👤 Users
Get all users
Retrieve a list of all users.

Responses
200 Success
400 Bad request

get
/users
Request samples
JavaScript (Browser)Node.js (Axios)PHPcURLPython

Copy
const axios = require('axios');
axios.get('https://fakestoreapi.com/users')
  .then(response => console.log(response.data));
Response samples
200
Content type
application/json

Copy
Expand allCollapse all
[
{
"id": 0,
"username": "string",
"email": "string",
"password": "string"
}
]
Add a new user
Create a new user.

Request Body schema: application/json
required
id	
integer
username	
string
email	
string
password	
string
Responses
201 User created successfully
400 Bad request

post
/users
Request samples
PayloadJavaScript (Browser)Node.js (Axios)PHPcURLPython

Copy
const axios = require('axios');
const user = { username: 'john_doe', email: 'john@example.com', password: 'pass123' };
axios.post('https://fakestoreapi.com/users', user)
  .then(response => console.log(response.data));
Response samples
201
Content type
application/json

Copy
{
"id": 0,
"username": "string",
"email": "string",
"password": "string"
}
Get a single user
Retrieve details of a specific user by ID.

path Parameters
id
required
integer
Responses
200 Success
400 Bad request

get
/users/{id}
Request samples
JavaScript (Browser)Node.js (Axios)PHPcURLPython

Copy
const axios = require('axios');
axios.get('https://fakestoreapi.com/users/1')
  .then(response => console.log(response.data));
Response samples
200
Content type
application/json

Copy
{
"id": 0,
"username": "string",
"email": "string",
"password": "string"
}
Update a user
Update an existing user by ID.

path Parameters
id
required
integer
Request Body schema: application/json
required
id	
integer
username	
string
email	
string
password	
string
Responses
200 User updated successfully
400 Bad request

put
/users/{id}
Request samples
PayloadJavaScript (Browser)Node.js (Axios)PHPcURLPython

Copy
const axios = require('axios');
const user = { username: 'john_doe_updated', email: 'john.updated@example.com' };
axios.put('https://fakestoreapi.com/users/1', user)
  .then(response => console.log(response.data));
Response samples
200
Content type
application/json

Copy
{
"id": 0,
"username": "string",
"email": "string",
"password": "string"
}
Delete a user
Delete a specific user by ID.

path Parameters
id
required
integer
Responses
200 User deleted successfully
400 Bad request

delete
/users/{id}
Request samples
JavaScript (Browser)Node.js (Axios)PHPcURLPython

Copy
const axios = require('axios');
axios.delete('https://fakestoreapi.com/users/1')
  .then(response => console.log(response.data));
🔒 Auth
Login
Authenticate a user.

Request Body schema: application/json
required
username	
string
password	
string
Responses
200 Login successful
400 Bad request

post
/auth/login
Request samples
PayloadJavaScript (Browser)Node.js (Axios)PHPcURLPython

Copy
const axios = require('axios');
const credentials = { username: 'john_doe', password: 'pass123' };
axios.post('https://fakestoreapi.com/auth/login', credentials)
  .then(response => console.log(response.data));
Response samples
200
Content type
application/json

Copy
{
"token": "string"
}