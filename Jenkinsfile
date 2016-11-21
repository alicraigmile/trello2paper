node {
   stage('Preparation') { // for display purposes
      // Get some code from a GitHub repository
      git 'https://github.com/alicraigmile/trello2paper.git'
   }
   stage('Build') {
    sh "./ci.sh"
   }
}
