import express, { Application } from "express";
import cookieParser from "cookie-parser";
import fs from "fs";
import "dotenv/config";
import http from "http";
import path from "path";
import { limiter } from "./utils/rateLimit";
import userRoute from "./modules/user/route";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cron from 'node-cron';
// import authRoute from './modules/auth/route';
// import adminRoute from './modules/admin/route';
// import vendorRoute from './modules/vendor/route';
// import SocketService from './services/socket';

class App {
  public app: Application;
  public server: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.ensureLogDirectoryExists();
    this.applyMiddleware();
    this.routes();
    this.setupLogCleanup(); 
  }

  private ensureLogDirectoryExists(): void {
    const logDirectory = path.join(__dirname, "logs");
    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory, { recursive: true });
    }
  }

  private applyMiddleware(): void {
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
      })
    );
    this.app.use(compression());
    this.app.use(helmet());
    this.app.use(cookieParser());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(limiter);
    const logStream = fs.createWriteStream(
      path.join(__dirname, "logs", "access.log"),
      { flags: "a" }
    );
    this.app.use(morgan("combined", { stream: logStream }));
    this.app.use(morgan("dev"));
  }

  private routes(): void {
    this.app.use("/api/user", userRoute);
  }

  private setupLogCleanup(): void {
    cron.schedule('0 0 * * *', () => { 
      const logFilePath = path.join(__dirname, 'logs', 'access.log');
      this.deleteOldLogFile(logFilePath, 50);
    });
  }

  private deleteOldLogFile(filePath: string, maxDays: number): void {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log('Log file does not exist.');
          return;
        }
        console.error('Error checking log file:', err);
        return;
      }
      const fileAgeInDays = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60 * 24);
      if (fileAgeInDays > maxDays) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting log file:', err);
          } else {
            console.log(`Deleted log file: ${filePath} (older than ${maxDays} days)`);
          }
        });
      } else {
        console.log(`Log file is ${fileAgeInDays.toFixed(2)} days old, not deleting.`);
      }
    });
  }

  public startServer(port: number): void {
    this.server.listen(port, () => {
      console.log(`API-Gateway started on ${port}`);
    });
  }
}

export default App;
