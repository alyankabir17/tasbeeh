pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                git 'https://github.com/alyankabir17/tasbeeh.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t tasbeeh-app .'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh 'docker rm -f tasbeeh-container || true'
            }
        }

        stage('Run New Container') {
            steps {
                sh 'docker run -d -p 3000:3000 --name tasbeeh-container tasbeeh-app'
            }
        }
    }
}