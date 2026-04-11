pipeline {
    agent any

    environment {
        DATABASE_URL = credentials('DATABASE_URL')
        NEXTAUTH_SECRET = credentials('NEXTAUTH_SECRET')
        AUTH_SECRET = credentials('AUTH_SECRET')
    }

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
                sh '''
                    docker run -d -p 3000:3000 \
                        -e DATABASE_URL="${DATABASE_URL}" \
                        -e NEXTAUTH_SECRET="${NEXTAUTH_SECRET}" \
                        -e AUTH_SECRET="${AUTH_SECRET}" \
                        -e NEXTAUTH_URL="http://localhost:3000" \
                        --name tasbeeh-container \
                        tasbeeh-app
                '''
            }
        }
    }
}
