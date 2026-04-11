pipeline {
    agent any
    environment {
        IMAGE_NAME = "tasbeeh"
    }
    stages {
        stage('Build') {
            steps {
                sh "docker build -t $IMAGE_NAME:$BUILD_NUMBER ."
            }
        }
        stage('Deploy with Rollback Strategy') {
            steps {
                withCredentials([
                    string(credentialsId: 'DATABASE_URL', variable: 'DATABASE_URL'),
                    string(credentialsId: 'NEXTAUTH_SECRET', variable: 'NEXTAUTH_SECRET'),
                    string(credentialsId: 'AUTH_SECRET', variable: 'AUTH_SECRET')
                ]) {
                    sh """
                    # 1. Keep the current container running but rename it
                    docker rename tasbeeh tasbeeh_old || true
                    
                    # 2. Start the new container on a temporary port or just start it
                    docker run -d --name tasbeeh -p 3000:3000 \
                        -e DATABASE_URL=\$DATABASE_URL \
                        -e NEXTAUTH_SECRET=\$NEXTAUTH_SECRET \
                        -e AUTH_SECRET=\$AUTH_SECRET \
                        $IMAGE_NAME:$BUILD_NUMBER
                    
                    # 3. Health Check: Give Next.js 10 seconds to boot up
                    sleep 10
                    if docker ps | grep tasbeeh | grep "(healthy)" || [ \$(docker inspect -f '{{.State.Running}}' tasbeeh) = "true" ]; then
                        echo "New version is stable. Removing old backup..."
                        docker stop tasbeeh_old || true
                        docker rm tasbeeh_old || true
                    else
                        echo "New version failed! Rolling back..."
                        exit 1
                    fi
                    """
                }
            }
        }
    }
    post {
        failure {
            sh """
            echo "Deployment failed. Reverting to tasbeeh_old..."
            docker stop tasbeeh || true
            docker rm tasbeeh || true
            docker rename tasbeeh_old tasbeeh || true
            docker start tasbeeh || true
            """
        }
        always {
            sh "docker image prune -f"
        }
    }
}