#!/bin/bash
cd /home/kavia/workspace/code-generation/daily-tech-and-industry-news-digest-13685-13694/newsletter_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

