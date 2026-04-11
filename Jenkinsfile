pipeline {
    agent any
    environment {
        IMAGE_NAME = "tasbeeh"
        // Ensure Docker Compose can see these Jenkins variables
        BUILD_TAG = "${env.BUILD_NUMBER}"
    }
    stages {
        stage('Build') {
            steps {
                // Building with the build number tag
                sh "docker build -t $IMAGE_NAME:$BUILD_NUMBER ."
            }
        }

        stage('Deploy with Rollback') {
            steps {
                withCredentials([
                    string(credentialsId: 'DATABASE_URL', variable: 'DATABASE_URL'),
                    string(credentialsId: 'NEXTAUTH_SECRET', variable: 'NEXTAUTH_SECRET'),
                    string(credentialsId: 'AUTH_SECRET', variable: 'AUTH_SECRET')
                ]) {
                    sh """
                    # 1. Backup the current working container
                    docker rename tasbeeh tasbeeh_old || true
                    
                    # 2. Use Docker Compose to start the NEW version
                    # We pass the env variables directly to the command
                    IMAGE_NAME=$IMAGE_NAME BUILD_NUMBER=$BUILD_NUMBER \
                    DATABASE_URL=\$DATABASE_URL \
                    NEXTAUTH_SECRET=\$NEXTAUTH_SECRET \
                    AUTH_SECRET=\$AUTH_SECRET \
                    docker compose up -d
                    
                    # 3. Health Check
                    sleep 10
                    if [ \$(docker inspect -f '{{.State.Running}}' tasbeeh) = "true" ]; then
                        echo "New version is stable. Removing old backup..."
                        docker rm -f tasbeeh_old || true
                    else
                        echo "New version failed! Triggering Rollback..."
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
            
            # If the backup exists, bring it back to life
            if [ \$(docker ps -a -q -f name=tasbeeh_old) ]; then
                docker rename tasbeeh_old tasbeeh
                docker start tasbeeh
                echo "Rollback successful."
            else
                echo "Critical: No backup found."
            fi
            """
        }
        always {
            // Keep your Lenovo laptop clean!
            sh "docker image prune -f"
        }
    }
}