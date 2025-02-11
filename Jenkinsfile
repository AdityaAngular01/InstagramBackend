pipeline {
    agent any
    tools{
        nodejs 'node-20.18.2'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/AdityaAngular01/InstagramBackend.git'
            }
        }
        
        stage('Install Dependencies'){
            steps{
                sh 'npm install --force'
            }
        }
        stage('Testing'){
            steps{
                sh 'PORT=5000 MONGO_URI=your_mongo_url CLOUDINARY_CLOUD_NAME=your_cloud_name CLOUDINARY_API_KEY=your_api_key CLOUDINARY_API_SECRET=your_api_secret npm run test:ordered'
            }
        }
        stage('Build'){
            steps{
                echo 'Building'
            }
        }
        stage('Deploy'){
            steps{
                echo 'Deploying'
            }
        }
    }
}
