pipeline {
    agent any

    environment {
        DOCKERHUB = credentials('dockerhub-creds')
        BACKEND_IMAGE  = "hashinikavindya/movie-watchlist-backend:latest"
        FRONTEND_IMAGE = "hashinikavindya/movie-watchlist-frontend:latest"
        DOCKER_BUILDKIT = '0'
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
                    DOCKER_BUILDKIT=0 docker build -t $BACKEND_IMAGE ./backend
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                    echo "Building frontend..."
                    DOCKER_BUILDKIT=0 docker build -t $FRONTEND_IMAGE ./frontend
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
        stage('Deploy to Server') {
  steps {
    sh '''
      echo "Pulling latest images..."
      docker pull $BACKEND_IMAGE
      docker pull $FRONTEND_IMAGE

      echo "Ensuring network exists..."
      docker network create movie-net || true

      echo "Recreating backend..."
      docker rm -f movie-backend || true
      docker run -d --name movie-backend \
        --network movie-net --network-alias backend \
        -p 5000:5000 --restart unless-stopped \
        $BACKEND_IMAGE

      echo "Recreating frontend..."
      docker rm -f movie-frontend || true
      docker run -d --name movie-frontend \
        --network movie-net \
        -p 80:80 --restart unless-stopped \
        $FRONTEND_IMAGE
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
