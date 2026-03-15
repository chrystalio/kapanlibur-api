pipeline {
    agent any
    environment {
        DOCKER_USER = "chrystalio"
        IMAGE_NAME = "kapanlibur-api"
    }
    stages {
        stage('Build & Push') {
            steps {
                script {
                    docker.withRegistry('', 'docker-hub-creds') {
                        def myImage = docker.build("${DOCKER_USER}/${IMAGE_NAME}:${env.BUILD_NUMBER}")
                        myImage.push()
                        myImage.push("latest")
                    }
                }
            }
        }
    }
    post {
        always {
            sh "docker image prune -f"
        }
    }
}
