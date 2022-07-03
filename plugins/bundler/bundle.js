const fs = require("fs");
// const crypto = require("crypto");
const Zip = require("adm-zip");
const { exec } = require("child_process")

console.log("\x1b[32m[LOG]\x1b[0m - Attempting to bundle plugin.")
console.log("\x1b[32m[DBG]\x1b[0m - Current Directory: ", process.cwd());

if (fs.existsSync(`${process.cwd()}/croakerr-manifest.json`)) {
    console.log("\x1b[32m[DBG]\x1b[0m - Validating manifest.")
    let rawManifest = fs.readFileSync(`${process.cwd()}/croakerr-manifest.json`, "utf8");
    let manifest;
    try {
        manifest = JSON.parse(rawManifest);
    } catch (e) {
        console.error("\x1b[31m[ERR]\x1b[0m - Unable to create bundle.")
        console.error("\x1b[31m[ERR]\x1b[0m - Failed to read.")
        console.error(e);
        process.exit();
    }
    bundleFile(manifest);
} else {
    console.error("\x1b[31m[ERR]\x1b[0m - Unable to create bundle.")
    console.error("\x1b[31m[ERR]\x1b[0m - Missing manifest file.")
}


function bundleFile(manifest) {
    if (fs.existsSync("__bundler")) fs.rmSync("__bundler", { recursive: true });
    fs.mkdirSync("__bundler")

    fs.copyFileSync(`${process.cwd()}/croakerr-manifest.json`, `${process.cwd()}/__bundler/croakerr-manifest.json`);

    let { entrypoint } = manifest;
    fs.copyFileSync(`${process.cwd()}/${entrypoint}`, `${process.cwd()}/__bundler/${entrypoint.split("/").pop()}`);
    fs.copyFileSync(`${process.cwd()}/package.json`, `${process.cwd()}/__bundler/package.json`);
    fs.copyFileSync(`${process.cwd()}/package-lock.json`, `${process.cwd()}/__bundler/package-lock.json`);
    process.chdir(`${process.cwd()}/__bundler`)
    exec("npm install --omit=dev --only=prod", (e) => {
        if (!e) {
            let zip = new Zip();
            zip.addLocalFolder("./node_modules", "./node_modules");
            manifest.entrypoint = entrypoint.split("/").pop();
            console.log(manifest);
            zip.addFile("croakerr-manifest.json", JSON.stringify(manifest));
            zip.addLocalFile(`./${entrypoint.split("/").pop()}`);

            process.chdir(`${process.cwd()}/../`)
            zip.writeZip(`${process.cwd()}/${manifest.name.toLowerCase()}.${manifest.version.split(".").join("_")}.zip`, (e2) => {
                if (!e2) {
                    console.log("\x1b[32m[DBG]\x1b[0m Cleaning up...")
                    fs.rmSync(`${process.cwd()}/__bundler`, { recursive: true });
                    console.log(`\n\nbundle:${manifest.name.toLowerCase()}.${manifest.version.split(".").join("_")}.zip`);
                    process.exit();
                } else {
                    console.error("\x1b[31m[ERR]\x1b[0m - Unable to create bundle.")
                    console.error("\x1b[31m[ERR]\x1b[0m - Failed to write file.")
                    console.error(e2);
                }
            })
        } else {
            console.error("\x1b[31m[ERR]\x1b[0m - Unable to create bundle.")
            console.error("\x1b[31m[ERR]\x1b[0m - Dependency failed to install.")
            console.error(e);
        }
    })
}

// function encode(data) {
//     return Buffer.from(data).toString("base64");
// }

// function buildHash(content) {
//     return crypto.createHash('md5').update('some_string').digest("hex");
// }