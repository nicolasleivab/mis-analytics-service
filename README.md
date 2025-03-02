# DISCLAIMER

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. Please refer to the full [MIT License](https://github.com/nicolasleivab/mis-analytics-service/blob/main/LICENSE) for details on the terms and conditions.

# MIS-Analytics-service

Service that handles authentication and storage of config files for [mis-analytics app](https://github.com/nicolasleivab/mis-analytics).

## How to run this service locally:

### Using node

First setup nvm for using the node versio needed for this project.

```
nvm install && nvm use
```

Create an .env file with the neede variables to connect to your mongoDB instance and JWT secret.

```
MONGODB_URI=mongodburishowninconnectsettings
JWT_SECRET='SUPERSECRET'
PORT=3000
ALLOWED_ORIGINS=http://localhost:4000
```

### Or just use docker compose

Replace the variables in docker-compose.yml file and:

```
docker compose up -d
```

You can access the service at the port defined in docker-compose.yml (default: 3000).
