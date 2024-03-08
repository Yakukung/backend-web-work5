// app.ts
import express from "express";
import cors from 'cors';
import { router as movies } from "./api/movies";

export const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", movies);
