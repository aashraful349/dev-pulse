import app from "./app";
import config from "./config";
import { initDB } from "./db";
import net from "node:net";

net.setDefaultAutoSelectFamilyAttemptTimeout(2000);

const main=async ()=>{
    await initDB();
    app.listen(config.port,()=>{
    console.log(`server is running on port ${config.port}`);
})
}
main();
