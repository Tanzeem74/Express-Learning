import express, { type Application, type Request, type Response } from "express"
import { pool } from "./db"
import { userRoute } from "./modules/user/user.route"
import { profileRoute } from "./modules/profile/profile.route"
import { authRoute } from "./modules/auth/auth.route"
import cors from "cors"
import logger from "./middleware/logger"
import CookieParser from "cookie-parser"
import globalErrorHandler from "./middleware/globalErrorHandler"



const app: Application = express()

app.use(CookieParser())
app.use(express.json())
app.use(logger);

app.use(cors({
    origin: "http://localhost:3000",
}))

app.get('/', (req: Request, res: Response) => {
    //   res.send('Hello!')
    res.status(200).json({
        "message": "express-learning",
        "Author": "Tanzeem",
    })
})

app.use('/api/users', userRoute);
app.use('/api/profile', profileRoute);
app.use('/api/auth', authRoute);





// Global Error Handling Middleware
app.use(globalErrorHandler);



export default app;