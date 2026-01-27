pipeline {
    agent any
    
    environment {
        // You'll need to set up these credentials in Jenkins
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', 
                    url: 'https://github.com/hashi-kavi/movie-watchlist.git',
                    credentialsId: 'github-credentials' // If you have GitHub credentials
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
                script {
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
        }
        
        stage('Push Images to Docker Hub') {
            steps {
                script {
                    sh '''
                        echo "Pushing backend image..."
                        docker push hashikavi/movie-watchlist-backend:latest
                        
                        echo "Pushing frontend image..."
                        docker push hashikavi/movie-watchlist-frontend:latest
                    '''
                }
            }
        }
        
        stage('Clean Up') {
            steps {
                sh '''
                    echo "Cleaning up..."
                    docker logout || true
                    # Optionally remove local images to save space
                    docker rmi hashikavi/movie-watchlist-backend:latest || true
                    docker rmi hashikavi/movie-watchlist-frontend:latest || true
                '''
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completed'
        }
        success {
            echo '✅ Build and push successful!'
        }
        failure {
            echo '❌ Build failed. Check logs.'
        }
    }
}
