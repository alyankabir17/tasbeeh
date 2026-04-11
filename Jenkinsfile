pipeline {
    agent any

    stages {
        stage('Build Docker Image') {
            steps {
                echo "Building Docker Image..."
                sh 'docker build -t tasbeeh-app .'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh 'docker stop tasbeeh-container || true'
                sh 'docker rm tasbeeh-container || true'
            }
        }

        stage('Run New Container') {
            steps {
                sh 'docker run -d -p 3000:3000 --name tasbeeh-container tasbeeh-app'
            }
        }
    }
}
