# To-Do Web Application 

### Run using only Docker:

Build the docker image:

`docker build --platform linux/amd64 -t todo-app .`

Create a network for connecting the app and database:

`docker network create todo-network`

Run MongoDB container:

`docker run --network todo-network --name mongo-service mongo`

Run Todo app container:

`docker run -p 8080:8080 --network todo-network -t todo-app`

Open a browser and navigate to http://localhost:8080/todo.html.

### Run using Kubernetes (minikube):

Create deployments and services:

`minikube kubectl -- apply -f deployment/mongo.yaml`

`minikube kubectl -- apply -f deployment/todo-app.yaml`

Create a tunnel to access the app through a browser:

`minikube service todo-service --url`

Open a browser and navigate to the url outputted by the previous command appended with `"/todo.html"`.

