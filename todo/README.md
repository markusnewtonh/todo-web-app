### Run using only Docker instructions:

Build the docker image:

`docker build --platform linux/amd64 -t todo-app .`

Create a network for connecting the app and database:

`docker network create todo-network`

Run MongoDB container:

`docker run --network todo-network --name todo-db mongo`

Run Todo app container:

`docker run -p 8080:8080 --network todo-network -t todo-app`

Open a browser and navigate to http://localhost:8080/todo.html.

