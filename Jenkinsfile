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
                sh 'npm install'
            }
        }
        stage('Testing'){
            steps{
                sh 'PORT=5000 MONGO_URI="mongodb://localhost:27017/instagram" npm run test'
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
