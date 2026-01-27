pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Images') {
      steps {
        sh '''
          docker build -t hashinikavindya/movie-watchlist-backend:latest ./backend
          docker build -t hashinikavindya/movie-watchlist-frontend:latest ./frontend
        '''
      }
    }

    stage('Login Docker Hub') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-login',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
        }
      }
    }

    stage('Push Images') {
      steps {
        sh '''
          docker push hashinikavindya/movie-watchlist-backend:latest
          docker push hashinikavindya/movie-watchlist-frontend:latest
        '''
      }
    }
  }

  post {
    success { echo "✅ Build & Push success" }
    failure { echo "❌ Build failed. Check logs." }
  }
}

