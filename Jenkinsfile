pipeline {
    agent any
    environment {
        DOCKER_USER = "yourusername"
        IMAGE_NAME = "kapanlibur-api"
        PORTAINER_WEBHOOK = "PASTE_YOUR_PORTAINER_WEBHOOK_HERE"
    }
    stages {
        stage('Build') {
            steps {
                sh "docker build -t ${DOCKER_USER}/${IMAGE_NAME}:${BUILD_NUMBER} ."
                sh "docker tag ${DOCKER_USER}/${IMAGE_NAME}:${BUILD_NUMBER} ${DOCKER_USER}/${IMAGE_NAME}:latest"
            }
        }
        stage('Deploy') {
            steps {
                sh "curl -X POST ${PORTAINER_WEBHOOK}"
            }
        }
    }
    post {
        always {
            sh "docker rmi ${DOCKER_USER}/${IMAGE_NAME}:${BUILD_NUMBER} || true"
        }
    }
}
