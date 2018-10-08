import { fork } from "child_process";
import * as path from "path";

const forked = fork(path.join(__dirname, "./node.process"));

forked.on("message", msg => {
    console.log("Message from child", msg.counter);
});

forked.send({ hello: "world" });
