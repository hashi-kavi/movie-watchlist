pipeline {
    agent any

    environment {
        DOCKERHUB = credentials('dockerhub-creds')
        BACKEND_IMAGE  = "hashinikavindya/movie-watchlist-backend:latest"
        FRONTEND_IMAGE = "hashinikavindya/movie-watchlist-frontend:latest"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/hashi-kavi/movie-watchlist.git'
            }
        }

        stage('Login to Docker Hub') {
            steps {
                sh '''
                    echo "$DOCKERHUB_PSW" | docker login -u "$DOCKERHUB_USR" --password-stdin
                '''
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                    echo "Building backend..."
                    docker build -t $BACKEND_IMAGE ./backend
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                    echo "Building frontend..."
                    docker build -t $FRONTEND_IMAGE ./frontend
                '''
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                    echo "Pushing backend..."
                    docker push $BACKEND_IMAGE

                    echo "Pushing frontend..."
                    docker push $FRONTEND_IMAGE
                '''
            }
        }

        stage('Clean Up') {
            steps {
                sh '''
                    docker logout || true
                    docker rmi $BACKEND_IMAGE || true
                    docker rmi $FRONTEND_IMAGE || true
                '''
            }
        }
    }

    post {
        success { echo '✅ Backend & Frontend images pushed successfully!' }
        failure { echo '❌ Build failed. Check Console Output.' }
    }
}
