# Docs for the Azure Web Apps Deploy action: https://github.com/Azure/webapps-deploy
# More GitHub Actions for Azure: https://github.com/Azure/actions
name: Build and deploy Node.js app to Azure Web App - FrontendDeploy

on:
  push:
    branches:
      - master
  workflow_dispatch:

jobs:
  build:
    runs-on: windows-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js version
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'

      - name: npm install, build, and test
        run: |
          npm install
          npm run build --if-present
          npm run test --if-present
      
      - name: Upload artifact for deployment job
        uses: actions/upload-artifact@v3
        with:
          name: node-app
          path: .

  deploy:
    runs-on: ubuntu-latest
    needs: build
    environment:
      name: 'production'
      url: ${{ steps.deploy-to-webapp.outputs.webapp-url }}
    permissions:
      id-token: write #This is required for requesting the JWT

    steps:
      - name: Download artifact from build job
        uses: actions/download-artifact@v3
        with:
          name: node-app
      
      - name: Login to Azure
        uses: azure/login@v1
        with:
          client-id: ${{ secrets.__clientidsecretname__ }}
          tenant-id: ${{ secrets.__tenantidsecretname__ }}
          subscription-id: ${{ secrets.__subscriptionidsecretname__ }}

      - name: 'Deploy to Azure Web App'
        uses: azure/webapps-deploy@v2
        id: deploy-to-webapp
        with:
          app-name: 'FrontendDeploy'
          slot-name: 'production'
          package: .
