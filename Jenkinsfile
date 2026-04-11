pipeline {
    agent any

    environment {
        IMAGE_NAME = "tasbeeh"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/alyankabir17/tasbeeh.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t $IMAGE_NAME:$BUILD_NUMBER ."
            }
        }

        stage('Stop Old Container') {
            steps {
                sh "docker stop tasbeeh || true"
                sh "docker rm tasbeeh || true"
            }
        }

     stage('Run New Container') {
    steps {
        withCredentials([
            string(credentialsId: 'DATABASE_URL', variable: 'DATABASE_URL'),
            string(credentialsId: 'NEXTAUTH_SECRET', variable: 'NEXTAUTH_SECRET'),
            string(credentialsId: 'AUTH_SECRET', variable: 'AUTH_SECRET')
        ]) {
            // Notice the \$ before the environment variables
            sh """
            docker run -d \
            --name tasbeeh \
            -p 3000:3000 \
            -e DATABASE_URL=\$DATABASE_URL \
            -e NEXTAUTH_SECRET=\$NEXTAUTH_SECRET \
            -e AUTH_SECRET=\$AUTH_SECRET \
            ${IMAGE_NAME}:${env.BUILD_NUMBER}
            """
        }
    }
}

        stage('Cleanup') {
            steps {
                sh "docker system prune -f"
                sh "docker image prune -f"
            }
        }
    }
}