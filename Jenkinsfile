pipeline {
    agent any

    tools {
        nodejs 'node-20' // Assumes NodeJS is configured in Jenkins Global Tool Configuration
    }

    environment {
        DOCKER_IMAGE = 'catchmydream'
        DOCKER_TAG = 'latest'
        SONAR_SCANNER_HOME = tool 'sonar-scanner' // Assumes SonarQube Scanner is configured
    }

    stages {
        stage('Clone Repository') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Next.js App') {
            steps {
                sh 'npm run build'
            }
        }

        stage('SonarQube Static Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') { // Assumes SonarQube server is configured in Jenkins
                    sh "${SONAR_SCANNER_HOME}/bin/sonar-scanner \
                        -Dsonar.projectKey=catchmydream \
                        -Dsonar.projectName=catchmydream \
                        -Dsonar.sources=. \
                        -Dsonar.exclusions=**/node_modules/**,.next/** \
                        -Dsonar.host.url=http://localhost:9000"
                }
            }
        }

        stage('Trivy Security Scan') {
            steps {
                script {
                    echo 'Running Trivy filesystem scan...'
                    sh 'trivy fs --severity HIGH,CRITICAL --format table .'
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
            }
        }

        stage('Trivy Image Scan') {
            steps {
                sh "trivy image --severity HIGH,CRITICAL --format table ${DOCKER_IMAGE}:${DOCKER_TAG}"
            }
        }

        stage('Docker Run') {
            steps {
                script {
                    // Stop and remove existing container if it exists
                    sh 'docker ps -aq --filter name=catchmydream-container | xargs -r docker rm -f'
                    // Run new container
                    sh "docker run -d -p 3001:3000 --name catchmydream-container ${DOCKER_IMAGE}:${DOCKER_TAG}"
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline execution failed!'
        }
    }
}
