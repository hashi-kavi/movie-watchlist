pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/hashi-kavi/movie-watchlist.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('backend') {
                    script {
                        sh '''
                            echo "Building backend Docker image..."
                            docker build -t hashikavi/movie-watchlist-backend:latest .
                        '''
                    }
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('frontend') {
                    script {
                        sh '''
                            echo "Building frontend Docker image..."
                            docker build -t hashikavi/movie-watchlist-frontend:latest .
                        '''
                    }
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USERNAME',
                    passwordVariable: 'DOCKER_PASSWORD'
                )]) {
                    sh '''
                        echo "Logging into Docker Hub..."
                        echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
                    '''
                }
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                sh '''
                    echo "Pushing backend image..."
                    docker push hashikavi/movie-watchlist-backend:latest

                    echo "Pushing frontend image..."
                    docker push hashikavi/movie-watchlist-frontend:latest
                '''
            }
        }

        stage('Clean Up') {
            steps {
                sh '''
                    echo "Cleaning up..."
                    docker logout || true
                    docker rmi hashikavi/movie-watchlist-backend:latest || true
                    docker rmi hashikavi/movie-watchlist-frontend:latest || true
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Build and push successful!'
        }
        failure {
            echo '❌ Build failed. Check logs.'
        }
    }
}
