import remix from '@remix-run/express'
import express from 'express'
import build from './build/index'

const app = express();

app.all(
  "*",
  remix.createRequestHandler({ build: build })
);