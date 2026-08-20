pipeline {
    agent any

    environment {
        DOCKERHUB_CREDS = credentials('dockerhub-creds')       // Username + access token
        GIT_CREDS       = credentials('deploy-repo-git-creds') // SSH key or PAT with push access
        IMAGE_NAME      = "your-dockerhub-username/service-a"
        IMAGE_TAG       = "${env.BUILD_NUMBER}"
        DEPLOY_REPO_URL = "git@github.com:your-org/service-a-deployment-repo.git" // or https:// URL
        VALUES_FILE     = "helm/service-a/values.yaml"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh """
                    echo "${DOCKERHUB_CREDS_PSW}" | docker login -u "${DOCKERHUB_CREDS_USR}" --password-stdin
                    docker push ${IMAGE_NAME}:${IMAGE_TAG}
                """
            }
        }

        stage('Update Helm Chart Tag in Deployment Repo') {
            steps {
                sh """
                    rm -rf deploy-repo
                    git clone ${DEPLOY_REPO_URL} deploy-repo
                    cd deploy-repo

                    sed -i "s|^\\(\\s*repository:\\s*\\).*service-a\$|\\1${IMAGE_NAME}|" ${VALUES_FILE} || true
                    sed -i "/serviceA:/,/nanoServiceA:/ s|^\\(\\s*tag:\\s*\\).*\$|\\1${IMAGE_TAG}|" ${VALUES_FILE}

                    git config user.email "jenkins@local"
                    git config user.name "jenkins"
                    git add ${VALUES_FILE}
                    git commit -m "ci: update service-a image tag to ${IMAGE_TAG}" || echo "No changes to commit"
                    git push origin HEAD:main
                """
            }
        }
    }

    post {
        always {
            sh "docker logout || true"
        }
        success {
            echo "Built, pushed ${IMAGE_NAME}:${IMAGE_TAG} and updated deployment repo."
        }
    }
}
