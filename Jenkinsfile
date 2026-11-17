pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '10'))
    timeout(time: 30, unit: 'MINUTES')
  }

  environment {
    REGISTRY = 'localhost:5000'
  }

  stages {
    stage('Prepare') {
      steps {
        script {
          env.IMAGE_TAG = sh(returnStdout: true, script: 'git rev-parse --short=7 HEAD').trim()
        }
        sh 'java -version && node -v && docker version --format "{{.Server.Version}}"'
      }
    }

    stage('Build & test') {
      parallel {
        stage('Backend') {
          steps {
            dir('services/catalog-service') {
              sh './mvnw -B verify'
            }
          }
          post {
            always {
              junit allowEmptyResults: true, testResults: 'services/catalog-service/target/surefire-reports/*.xml'
            }
          }
        }
        stage('Frontend') {
          steps {
            dir('frontend') {
              sh 'npm ci'
              sh 'npm run lint'
              sh 'npm run build'
            }
          }
        }
      }
    }

    stage('Docker build') {
      steps {
        retry(2) {
          sh 'docker build -t $REGISTRY/catalog-service:$IMAGE_TAG services/catalog-service'
        }
        retry(2) {
          sh 'docker build -t $REGISTRY/frontend:$IMAGE_TAG frontend'
        }
      }
    }

    stage('Trivy scan') {
      steps {
        script {
          ['catalog-service', 'frontend'].each { img ->
            sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v trivy-cache:/root/.cache/ aquasec/trivy:latest image --exit-code 1 --severity HIGH,CRITICAL --ignore-unfixed ${env.REGISTRY}/${img}:${env.IMAGE_TAG}"
          }
        }
      }
    }

    stage('Push') {
      when { branch 'main' }
      steps {
        sh 'docker push $REGISTRY/catalog-service:$IMAGE_TAG'
        sh 'docker push $REGISTRY/frontend:$IMAGE_TAG'
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}