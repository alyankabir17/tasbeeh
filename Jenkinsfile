pipeline {
    agent any
    environment {
        IMAGE_NAME = "tasbeeh"
        BUILD_TAG = "${env.BUILD_NUMBER}"
    }
    stages {
        stage('Build') {
            steps {
                sh "docker build -t $IMAGE_NAME:$BUILD_NUMBER ."
            }
        }

        stage('Deploy & Monitor') {
            steps {
                withCredentials([
                    string(credentialsId: 'DATABASE_URL', variable: 'DATABASE_URL'),
                    string(credentialsId: 'NEXTAUTH_SECRET', variable: 'NEXTAUTH_SECRET'),
                    string(credentialsId: 'AUTH_SECRET', variable: 'AUTH_SECRET'),
                    string(credentialsId: 'DISCORD_WEBHOOK', variable: 'DISCORD_URL')
                ]) {
                    sh """
                    # 1. Prepare for deployment
                    docker stop tasbeeh_old || true
                    docker rm tasbeeh_old || true
                    docker rename tasbeeh tasbeeh_old || true
                    docker stop tasbeeh_old || true

                    # 2. Run new version using Compose
                    IMAGE_NAME=$IMAGE_NAME BUILD_NUMBER=$BUILD_NUMBER \
                    DATABASE_URL=\$DATABASE_URL \
                    NEXTAUTH_SECRET=\$NEXTAUTH_SECRET \
                    AUTH_SECRET=\$AUTH_SECRET \
                    docker compose up -d

                    # 3. Log Monitoring: Wait 20 seconds to catch runtime crashes
                    echo "Monitoring logs for errors..."
                    sleep 20
                    
                    # Search for error keywords in the container logs
                    if docker logs tasbeeh 2>&1 | grep -Ei "error|exception|failed|denied"; then
                        echo "⚠️ Errors detected in application logs!"
                        curl -H "Content-Type: application/json" -X POST -d '{"content": "🚨 **Build #$BUILD_NUMBER Failed!** Errors detected in logs for Tasbeeh."}' \$DISCORD_URL
                        exit 1
                    fi

                    # 4. Final Health Check
                    if [ \$(docker inspect -f '{{.State.Running}}' tasbeeh) = "true" ]; then
                        echo "Deployment stable."
                        curl -H "Content-Type: application/json" -X POST -d '{"content": "🚀 **Build #$BUILD_NUMBER Success!** Tasbeeh is live and healthy."}' \$DISCORD_URL
                        docker rm -f tasbeeh_old || true
                    else
                        echo "Container is not running!"
                        exit 1
                    fi
                    """
                }
            }
        }
    }
    post {
        failure {
            withCredentials([string(credentialsId: 'DISCORD_WEBHOOK', variable: 'DISCORD_URL')]) {
                sh """
                echo "Deployment failed. Reverting to tasbeeh_old..."
                curl -H "Content-Type: application/json" -X POST -d '{"content": "🔄 **Build #$BUILD_NUMBER Failed.** Rolling back to previous version."}' \$DISCORD_URL
                
                docker stop tasbeeh || true
                docker rm tasbeeh || true
                
                if [ \$(docker ps -a -q -f name=tasbeeh_old) ]; then
                    docker rename tasbeeh_old tasbeeh
                    docker start tasbeeh
                    echo "Rollback successful."
                else
                    echo "Critical: No backup found."
                fi
                """
            }
        }
        always {
            sh "docker image prune -f"
        }
    }
}