# Web Service for Software Analysis and Maintenance Framework 

This web service application for Software Analysis and Maintenance (SAMF) extends from Java Servlet port to Node.js 

### How to install
```
git clone https://github.com/Kusumoto/samf-webservice.git
npm install -g
vi src/mongo_uri.json and add mongodb uri in element 'mongo_uri'
```
### How to start web service
```
npm start
```

### Docker Install
```
docker run --name samf-webservice -e MONGO_URI=[your mongo connection uri] -p 8080:8080 -d kusumoto/samf-webservice
```
### Environment
```MONGO_URI``` = You MongoDB Connection URI

### More information and contact to developer
* [Website :: https://kusumotolab.com](https://kusumotolab.com)
* [Twitter :: @Kusumoto_ton](https://twtter.com/kusumoto_ton)
* [Facebook :: Weerayut Hongsa](https://facebook.com/Azerdar.t.Kusumoto)

